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
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-accent" />
        <h1 className="text-xl font-bold text-foreground tracking-tight">BioGen</h1>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
        </button>
        <ApiKeyModal hasKey={hasApiKey} onSave={onApiKeySave} />
      </div>
    </header>
  );
};

export default Header;
