import { useState } from "react";
import { Moon, Sun, Zap, LogOut, User as UserIcon, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import ReferralDashboard from "./ReferralDashboard";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

const initials = (email?: string | null) => {
  if (!email) return "U";
  const base = email.split("@")[0];
  return (base.slice(0, 2) || "U").toUpperCase();
};

const Header = ({ darkMode, onToggleDark }: HeaderProps) => {
  const { user, openAuth, signOut } = useAuth();
  const [refOpen, setRefOpen] = useState(false);

  return (
    <header className="animate-fade-in-down sticky top-0 z-50 glass-strong">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative">
            <Zap className="w-6 h-6 text-primary fill-primary transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">BioDraft</h1>
            <span className="hidden sm:inline text-[10px] text-muted-foreground mt-0.5">
              Generate scroll-stopping bios in seconds
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-bold text-sm flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                  aria-label="Account menu"
                >
                  {initials(user.email)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong border-border/50">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRefOpen(true)}>
                  <Gift className="w-4 h-4 mr-2" /> My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={openAuth}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <UserIcon className="w-4 h-4" /> Sign In
            </Button>
          )}
          <button
            onClick={onToggleDark}
            className="p-2.5 rounded-xl hover:bg-secondary transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-muted-foreground transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
      <ReferralDashboard open={refOpen} onOpenChange={setRefOpen} />
    </header>
  );
};

export default Header;
