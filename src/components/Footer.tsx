import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="relative py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          Made with <span className="text-accent animate-bounce-subtle inline-block">❤️</span> using AI
        </p>
        <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span className="font-semibold text-foreground/80">BioGen</span> — Free Forever
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
