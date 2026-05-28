import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ReferralDashboard from "./ReferralDashboard";

const LimitModal = () => {
  const { limitOpen, setLimitOpen, user, openAuth } = useAuth();
  const [refOpen, setRefOpen] = useState(false);

  const loggedIn = !!user;

  return (
    <>
      <Dialog open={limitOpen} onOpenChange={setLimitOpen}>
        <DialogContent className="glass-strong border-border/50 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <DialogTitle>
                {loggedIn ? "You've hit your monthly limit" : "You've used your free generations"}
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-base">
              {loggedIn
                ? "You've used all your generations this month. Refer friends to earn more!"
                : "Sign up free to get 10 more bios + 5 captions every month."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 pt-2">
            {loggedIn ? (
              <Button
                onClick={() => {
                  setLimitOpen(false);
                  setRefOpen(true);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Users className="w-4 h-4" />
                Refer Friends
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setLimitOpen(false);
                  openAuth();
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Sign Up Free
              </Button>
            )}
            <Button variant="ghost" onClick={() => setLimitOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ReferralDashboard open={refOpen} onOpenChange={setRefOpen} />
    </>
  );
};

export default LimitModal;
