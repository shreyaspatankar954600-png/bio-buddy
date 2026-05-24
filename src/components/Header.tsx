import { Moon, Sun, Zap } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

const Header = ({ darkMode, onToggleDark }: HeaderProps) => {
  return (
    <header className="animate-fade-in-down sticky top-0 z-50 glass-strong">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative">
            <Zap className="w-6 h-6 text-primary fill-primary transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              BioDraft
            </h1>
            <span className="hidden sm:inline text-[10px] text-muted-foreground mt-0.5">
              Generate scroll-stopping bios in seconds
            </span>
          </div>
        </div>
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
    </header>
  );
};

export default Header;
