import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  email: string | null;
  referral_code: string | null;
  referred_by: string | null;
  bio_generations_used: number;
  caption_generations_used: number;
  bonus_generations: number;
  generations_reset_date: string | null;
}

type Kind = "bio" | "caption";

interface AuthCtx {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  // Limit helpers
  canGenerate: (kind: Kind) => { ok: boolean; used: number; total: number };
  recordGeneration: (kind: Kind) => Promise<void>;
  openAuth: () => void;
  openLimit: (kind: Kind) => void;
  // Modal triggers (set by provider consumer)
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  limitOpen: boolean;
  setLimitOpen: (v: boolean) => void;
  limitKind: Kind;
}

const Ctx = createContext<AuthCtx | null>(null);

const FREE_BIO = 3;
const FREE_CAPTION = 2;
const MONTHLY_BIO = 10;
const MONTHLY_CAPTION = 5;

const LS_BIO = "bio_free_used";
const LS_CAP = "caption_free_used";

const safe = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn();
  } catch (e) {
    console.warn("[auth] silent fail:", e);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitKind, setLimitKind] = useState<Kind>("bio");
  // bump local-storage reader on change
  const [, setTick] = useState(0);

  const fetchProfile = useCallback(async (uid: string) => {
    if (!supabase) return;
    const res = await safe(async () => {
      const { data, error } = await supabase!
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    });
    if (!res) return;

    // Monthly reset check
    let p = res;
    const now = new Date();
    if (p?.generations_reset_date && new Date(p.generations_reset_date) < now) {
      const next = new Date();
      next.setDate(next.getDate() + 30);
      await safe(async () => {
        const { data, error } = await supabase!
          .from("profiles")
          .update({
            bio_generations_used: 0,
            caption_generations_used: 0,
            generations_reset_date: next.toISOString(),
          })
          .eq("id", uid)
          .select()
          .maybeSingle();
        if (error) throw error;
        if (data) p = data as Profile;
      });
    }
    setProfile(p);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
  }, []);

  const canGenerate = useCallback(
    (kind: Kind) => {
      if (!user || !profile) {
        const usedKey = kind === "bio" ? LS_BIO : LS_CAP;
        const limit = kind === "bio" ? FREE_BIO : FREE_CAPTION;
        const used = parseInt(localStorage.getItem(usedKey) || "0", 10) || 0;
        return { ok: used < limit, used, total: limit };
      }
      const bonus = profile.bonus_generations || 0;
      const usedBio = profile.bio_generations_used || 0;
      const usedCap = profile.caption_generations_used || 0;
      const totalPool = MONTHLY_BIO + MONTHLY_CAPTION + bonus;
      const usedPool = usedBio + usedCap;
      // Per-type soft cap, but bonus pool is shared
      const used = kind === "bio" ? usedBio : usedCap;
      const baseLimit = kind === "bio" ? MONTHLY_BIO : MONTHLY_CAPTION;
      const ok = used < baseLimit + bonus && usedPool < totalPool;
      return { ok, used: usedPool, total: totalPool };
    },
    [user, profile]
  );

  const incrementLocal = (kind: Kind) => {
    const key = kind === "bio" ? LS_BIO : LS_CAP;
    const cur = parseInt(localStorage.getItem(key) || "0", 10) || 0;
    localStorage.setItem(key, String(cur + 1));
    setTick((t) => t + 1);
  };

  const completeReferralIfNeeded = useCallback(async () => {
    if (!supabase || !user || !profile?.referred_by) return;
    await safe(async () => {
      // Mark this user's referral as completed
      const { data: ref, error: refErr } = await supabase!
        .from("referrals")
        .update({ completed: true })
        .eq("referred_id", user.id)
        .eq("completed", false)
        .select()
        .maybeSingle();
      if (refErr) throw refErr;
      if (!ref) return;

      // Count referrer's completed & not-yet-granted referrals
      const referrerId = (ref as any).referrer_id as string;
      const { data: pending, error: pErr } = await supabase!
        .from("referrals")
        .select("id")
        .eq("referrer_id", referrerId)
        .eq("completed", true)
        .eq("bonus_granted", false);
      if (pErr) throw pErr;
      if (!pending || pending.length < 5) return;

      const toMark = pending.slice(0, 5).map((r: any) => r.id);
      // Fetch current referrer bonus
      const { data: refProfile } = await supabase!
        .from("profiles")
        .select("bonus_generations")
        .eq("id", referrerId)
        .maybeSingle();
      const newBonus = ((refProfile as any)?.bonus_generations || 0) + 5;
      await supabase!.from("profiles").update({ bonus_generations: newBonus }).eq("id", referrerId);
      await supabase!.from("referrals").update({ bonus_granted: true }).in("id", toMark);
    });
  }, [user, profile]);

  const recordGeneration = useCallback(
    async (kind: Kind) => {
      if (!user || !profile) {
        incrementLocal(kind);
        return;
      }
      // Optimistic local update
      const col = kind === "bio" ? "bio_generations_used" : "caption_generations_used";
      const next = (profile[col as keyof Profile] as number) + 1;
      setProfile({ ...profile, [col]: next } as Profile);
      await safe(async () => {
        if (!supabase) return;
        await supabase.from("profiles").update({ [col]: next }).eq("id", user.id);
      });
      // Trigger referral completion on first generation
      await completeReferralIfNeeded();
    },
    [user, profile, completeReferralIfNeeded]
  );

  const openAuth = useCallback(() => setAuthOpen(true), []);
  const openLimit = useCallback((kind: Kind) => {
    setLimitKind(kind);
    setLimitOpen(true);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
        signOut,
        canGenerate,
        recordGeneration,
        openAuth,
        openLimit,
        authOpen,
        setAuthOpen,
        limitOpen,
        setLimitOpen,
        limitKind,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
