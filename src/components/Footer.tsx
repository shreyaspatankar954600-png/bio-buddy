import { Zap, Twitter, MessageCircle } from "lucide-react";

const SHARE_URL = "https://bio--buddy.vercel.app";
const SHARE_TEXT =
  "Just generated my perfect bio with BioDraft — free AI bio generator for Instagram & LinkedIn. Try it:";

const Footer = () => (
  <footer className="relative mt-12 border-t border-border/40">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid gap-6 md:grid-cols-3 items-start">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary fill-primary" />
          <span className="font-extrabold text-foreground">BioDraft</span>
        </div>
        <p className="text-xs text-muted-foreground">
          AI bios that don't sound like a robot wrote them.
        </p>
      </div>

      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-center">
        <a href="#top" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
        <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
        <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
      </nav>

      <div className="flex md:justify-end gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          <Twitter className="w-3.5 h-3.5" /> Share on X
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </div>
    <div className="border-t border-border/40">
      <p className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-[11px] text-muted-foreground">
        © 2025 BioDraft. Built for creators who mean business.
      </p>
    </div>
  </footer>
);

export default Footer;
