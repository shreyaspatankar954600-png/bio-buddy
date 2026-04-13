import { useState } from "react";
import { Copy, Check, Heart, MessageCircle, Send, Bookmark, Grid3X3, Camera, Users, MoreHorizontal, MapPin, Link2, Briefcase, GraduationCap, Building2 } from "lucide-react";

interface PlatformPreviewProps {
  bio: string;
  name: string;
  profession: string;
  platform: "instagram" | "linkedin";
}

const PlatformPreview = ({ bio, name, profession, platform }: PlatformPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = name || "Your Name";
  const username = name ? name.toLowerCase().replace(/\s+/g, "") : "username";

  if (platform === "instagram") {
    return (
      <div className="w-full max-w-[320px] mx-auto">
        {/* Phone frame */}
        <div className="rounded-[2rem] border-[3px] border-foreground/20 bg-card overflow-hidden shadow-lg">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-1.5 bg-card">
            <span className="text-[10px] font-semibold text-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-2 rounded-sm border border-foreground/40 relative">
                <div className="absolute inset-[1px] right-[2px] bg-foreground/60 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Instagram header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-sm font-bold text-foreground">{username}</span>
            <MoreHorizontal className="w-4 h-4 text-foreground" />
          </div>

          {/* Profile section */}
          <div className="px-4 pt-3 pb-4">
            {/* Avatar + stats row */}
            <div className="flex items-center gap-4 mb-3">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] p-[2px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              {/* Stats */}
              <div className="flex flex-1 justify-around">
                {[["42", "Posts"], ["1.2K", "Followers"], ["348", "Following"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-sm font-bold text-foreground">{num}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Name & Bio */}
            <p className="text-xs font-bold text-foreground">{displayName}</p>
            {profession && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{profession}</p>
            )}
            <p className="text-xs text-foreground mt-1 leading-relaxed whitespace-pre-wrap">{bio}</p>

            {/* Action buttons */}
            <div className="flex gap-1.5 mt-3">
              <button className="flex-1 bg-primary text-primary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Follow</button>
              <button className="flex-1 bg-secondary text-secondary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Message</button>
            </div>

            {/* Tab bar */}
            <div className="flex border-t border-border mt-3 pt-2">
              {[Grid3X3, Camera, Users].map((Icon, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <Icon className={`w-4 h-4 ${i === 0 ? "text-foreground" : "text-muted-foreground"}`} />
                </div>
              ))}
            </div>

            {/* Fake grid */}
            <div className="grid grid-cols-3 gap-[1px] mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 rounded-lg hover:bg-secondary"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Bio"}
        </button>
      </div>
    );
  }

  // LinkedIn preview
  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        {/* LinkedIn banner */}
        <div className="h-16 bg-gradient-to-r from-[hsl(210,80%,50%)] to-[hsl(175,60%,45%)]" />

        {/* Profile */}
        <div className="px-4 pb-4 -mt-8">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full border-[3px] border-card bg-secondary flex items-center justify-center mb-2">
            <span className="text-xl font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-bold text-foreground">{displayName}</h3>
          {profession && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3" /> {profession}
            </p>
          )}

          {/* Location & connections */}
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> San Francisco Bay Area</span>
            <span className="text-primary font-medium">500+ connections</span>
          </div>

          {/* Bio / About */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">About</p>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{bio}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 mt-3">
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full bg-[hsl(210,80%,50%)] text-white">Connect</button>
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full border border-[hsl(210,80%,50%)] text-[hsl(210,80%,50%)]">Message</button>
          </div>

          {/* Experience placeholder */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Experience</p>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">{profession || "Your Role"}</p>
                <p className="text-[10px] text-muted-foreground">Company Name · Full-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 rounded-lg hover:bg-secondary"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Bio"}
      </button>
    </div>
  );
};

export default PlatformPreview;
