import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BioCardProps {
  bio: string;
  index: number;
  charLimit: number;
  platform: "instagram" | "linkedin";
}

const BioCard = ({ bio, index, charLimit, platform }: BioCardProps) => {
  const [copied, setCopied] = useState(false);
  const isOverLimit = bio.length > charLimit;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in bg-card rounded-xl p-5 shadow-bio-card hover:shadow-bio-card-hover transition-all duration-300 flex flex-col gap-3 border border-border">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${platform === "instagram" ? "text-accent" : "text-primary"}`}>
          Bio #{index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-foreground leading-relaxed text-sm">{bio}</p>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
          {bio.length} / {charLimit} chars
        </span>
        {isOverLimit && <span className="text-destructive font-medium">Over limit!</span>}
      </div>
    </div>
  );
};

export default BioCard;
