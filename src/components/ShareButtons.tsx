import { Twitter } from "lucide-react";
import { MessageCircle } from "lucide-react";

const ShareButtons = () => {
  const url = window.location.href;
  const twitterText = encodeURIComponent(`Just generated my bio using this free AI tool! 🔥 ${url}`);
  const whatsappText = encodeURIComponent(`Check out this free AI bio generator! 🔥 ${url}`);

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <span className="text-sm text-muted-foreground font-medium">Share this tool:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${twitterText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" /> Twitter
      </a>
      <a
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </a>
    </div>
  );
};

export default ShareButtons;
