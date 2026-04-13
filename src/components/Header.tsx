import { Moon, Sun, Sparkles } from "lucide-react";
import ApiKeyModal from "./ApiKeyModal";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  hasApiKey: boolean;
  onApiKeySave: (key: string) => void;
}

const Header = ({ darkMode, onToggleDark, hasApiKey, onApiKeySave }: HeaderProps) => {
  return (
    <header className="animate-fade-in-down sticky top-0 z-50 glass-strong">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:animate-wiggle" />
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">
            BioGen
          </h1>
          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent">
            AI
          </span>
        </div>
        <div className="flex items-center gap-1.5">
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
          <ApiKeyModal hasKey={hasApiKey} onSave={onApiKeySave} />
        </div>
      </div>
    </header>
  );
};

export default Header;
