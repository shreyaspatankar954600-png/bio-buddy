import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const AuthModal = () => {
  const { authOpen, setAuthOpen, refreshProfile } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (authOpen) {
      const code = localStorage.getItem("referral_code") || "";
      setReferral(code);
      setError("");
      setInfo("");
    }
  }, [authOpen]);

  const handleSignIn = async () => {
    if (!supabase) return setError("Auth unavailable.");
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    await refreshProfile();
    setAuthOpen(false);
  };

  const handleSignUp = async () => {
    if (!supabase) return setError("Auth unavailable.");
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/app" },
    });
    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    // Apply referral if provided
    const code = referral.trim();
    const newUserId = data.user?.id;
    if (code && newUserId) {
      try {
        const { data: ref } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", code)
          .maybeSingle();
        const referrerId = (ref as any)?.id;
        if (referrerId && referrerId !== newUserId) {
          await supabase.from("profiles").update({ referred_by: referrerId }).eq("id", newUserId);
          await supabase.from("referrals").insert({ referrer_id: referrerId, referred_id: newUserId });
        }
      } catch (e) {
        console.warn("[referral] silent fail", e);
      }
      localStorage.removeItem("referral_code");
    }

    setLoading(false);
    if (!data.session) {
      setInfo("Check your email to confirm your account, then sign in.");
      setTab("signin");
    } else {
      await refreshProfile();
      setAuthOpen(false);
    }
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="glass-strong border-border/50 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <DialogTitle>Welcome to BioDraft</DialogTitle>
          </div>
          <DialogDescription>
            Sign in to unlock 10 bios + 5 captions every month — free.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-3 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="si-pw">Password</Label>
              <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={handleSignIn} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-3 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-pw">Password</Label>
              <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-ref">Referral code <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input id="su-ref" value={referral} onChange={(e) => setReferral(e.target.value)} placeholder="ABC123" />
            </div>
            <Button onClick={handleSignUp} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Account"}
            </Button>
          </TabsContent>
        </Tabs>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        {info && <p className="text-xs text-primary font-medium">{info}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
