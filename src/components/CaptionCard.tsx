import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CaptionCardProps {
  label: string;
  emoji: string;
  content: string;
  accent?: "purple" | "blue" | "pink" | "amber" | "emerald";
  multiline?: boolean;
  delay?: number;
}

const accentMap = {
  purple: "from-purple-500 to-fuchsia-500",
  blue: "from-sky-500 to-blue-600",
  pink: "from-pink-500 to-rose-500",
  amber: "from-amber-500 to-orange-500",
  emerald: "from-emerald-500 to-teal-500",
};

const CaptionCard = ({ label, emoji, content, accent = "purple", multiline = false, delay = 0 }: CaptionCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in-up glass-strong rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`h-1 bg-gradient-to-r ${accentMap[accent]}`} />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="text-base">{emoji}</span> {label}
          </h4>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-300 ${
              copied
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div
          className={`bg-muted/40 rounded-xl px-3.5 py-3 text-sm text-foreground/90 leading-relaxed select-all ${
            multiline ? "whitespace-pre-wrap" : ""
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;
