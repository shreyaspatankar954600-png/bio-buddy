import { Twitter, MessageCircle, Share2 } from "lucide-react";

const ShareButtons = () => {
  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-3 pt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Share2 className="w-4 h-4" />
        Share this tool
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://twitter.com/intent/tweet?text=Just%20generated%20my%20perfect%20bio%20using%20this%20free%20AI%20tool!%20%F0%9F%94%A5%20Try%20it%20free%20here%3A%20https%3A%2F%2Fbio--buddy.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 bg-foreground text-background hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <Twitter className="w-4 h-4 transition-transform group-hover:-rotate-12" /> Share on X
        </a>
        <a
          href="https://wa.me/?text=Just%20generated%20my%20perfect%20bio%20using%20this%20free%20AI%20tool!%20%F0%9F%94%A5%20Try%20it%20free%20here%3A%20https%3A%2F%2Fbio--buddy.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{ backgroundColor: "#25D366", color: "white" }}
        >
          <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" /> WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
