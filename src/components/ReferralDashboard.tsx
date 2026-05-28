import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

interface ReferralRow {
  id: string;
  referred_id: string;
  completed: boolean;
  bonus_granted: boolean;
  created_at: string;
  referred_email?: string | null;
}

const hideEmail = (e?: string | null) => {
  if (!e) return "anonymous";
  const [name, domain] = e.split("@");
  if (!domain) return e;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`;
};

const ReferralDashboard = ({ open, onOpenChange }: Props) => {
  const { profile, user } = useAuth();
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [copied, setCopied] = useState(false);

  const link = profile?.referral_code
    ? `https://biodraft.vercel.app?ref=${profile.referral_code}`
    : "https://biodraft.vercel.app";

  const completedCount = rows.filter((r) => r.completed).length;
  const cappedProgress = Math.min(completedCount % 5 || (completedCount > 0 && completedCount % 5 === 0 ? 5 : 0), 5);
  const bonus = profile?.bonus_generations || 0;

  const load = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("id, referred_id, completed, bonus_granted, created_at")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const list = (data as any[]) || [];
      // Try to fetch emails of referred users
      const ids = list.map((r) => r.referred_id);
      let emailMap: Record<string, string> = {};
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", ids);
        (profs as any[] | null)?.forEach((p) => {
          emailMap[p.id] = p.email;
        });
      }
      setRows(list.map((r) => ({ ...r, referred_email: emailMap[r.referred_id] })));
    } catch (e) {
      console.warn("[referrals] load failed", e);
    }
  }, [user]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareText = `I'm using BioDraft — free AI bios & captions for Instagram and LinkedIn. Try it with my link: ${link}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/50 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Gift className="w-5 h-5" />
            <DialogTitle>Your Referrals</DialogTitle>
          </div>
          <DialogDescription>
            Refer 5 friends who sign up and use BioDraft → you earn 5 bonus generations.
          </DialogDescription>
        </DialogHeader>

        {/* Link */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your referral link</label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 text-xs truncate font-mono">
              {link}
            </div>
            <Button onClick={copyLink} size="sm" className="bg-primary hover:bg-primary/90 shrink-0">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{completedCount} of 5 friends joined</span>
            <span className="text-xs text-muted-foreground">+{bonus} bonus earned</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i < Math.min(completedCount, 5) ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="grid grid-cols-2 gap-2">
          <a href={wa} target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4" /> WhatsApp
            </Button>
          </a>
          <a href={x} target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4" /> Share on X
            </Button>
          </a>
        </div>

        {/* Referrals list */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your invites</h4>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6 glass rounded-xl">
              No referrals yet. Share your link to get started!
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 border border-border/40 text-xs">
                  <div className="flex flex-col">
                    <span className="font-mono">{hideEmail(r.referred_email)}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.completed
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {r.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDashboard;
