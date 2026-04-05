import { Twitter, MessageCircle } from "lucide-react";

const ShareButtons = () => {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <span className="text-sm text-muted-foreground font-medium">Share this tool:</span>
      <a
        href="https://twitter.com/intent/tweet?text=Just%20generated%20my%20perfect%20bio%20using%20this%20free%20AI%20tool!%20%F0%9F%94%A5%20Try%20it%20free%20here%3A%20https%3A%2F%2Fbio--buddy.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-black text-white hover:bg-black/80"
      >
        <Twitter className="w-3.5 h-3.5" /> Twitter
      </a>
      <a
        href="https://wa.me/?text=Just%20generated%20my%20perfect%20bio%20using%20this%20free%20AI%20tool!%20%F0%9F%94%A5%20Try%20it%20free%20here%3A%20https%3A%2F%2Fbio--buddy.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-white hover:opacity-80"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </a>
    </div>
  );
};

export default ShareButtons;
