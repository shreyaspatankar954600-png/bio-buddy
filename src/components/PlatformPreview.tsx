import { useState } from "react";
import { Copy, Check, Grid3X3, Camera, Users, MoreHorizontal, MapPin, Briefcase, Building2 } from "lucide-react";

interface PlatformPreviewProps {
  bio: string;
  name: string;
  profession: string;
  platform: "instagram" | "linkedin";
  delay?: number;
}

const PlatformPreview = ({ bio, name, profession, platform, delay = 0 }: PlatformPreviewProps) => {
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
      <div
        className="w-full max-w-[320px] mx-auto group"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Phone frame */}
        <div className="rounded-[2rem] border-[3px] border-foreground/10 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:glow-instagram">
          {/* Notch */}
          <div className="flex justify-center pt-2 pb-1 bg-card">
            <div className="w-20 h-5 bg-foreground/10 rounded-full" />
          </div>

          {/* Instagram header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
            <span className="text-sm font-bold text-foreground">{username}</span>
            <MoreHorizontal className="w-4 h-4 text-foreground/60" />
          </div>

          {/* Profile section */}
          <div className="px-4 pt-3 pb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary p-[2.5px] flex-shrink-0 animate-spin-slow" style={{ animationDuration: "8s" }}>
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex flex-1 justify-around">
                {[["42", "Posts"], ["1.2K", "Followers"], ["348", "Following"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-sm font-bold text-foreground">{num}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold text-foreground">{displayName}</p>
            {profession && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{profession}</p>
            )}
            {/* Bio text with highlight */}
            <div className="mt-1.5 p-2 rounded-lg bg-accent/5 border border-accent/10 transition-colors duration-300">
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>

            <div className="flex gap-1.5 mt-3">
              <button className="flex-1 gradient-instagram text-primary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Follow</button>
              <button className="flex-1 bg-secondary text-secondary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Message</button>
            </div>

            <div className="flex border-t border-border/50 mt-3 pt-2">
              {[Grid3X3, Camera, Users].map((Icon, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <Icon className={`w-4 h-4 ${i === 0 ? "text-foreground" : "text-muted-foreground/50"}`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-[2px] mt-2 rounded-sm overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted" />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-300 py-2.5 rounded-xl hover:bg-secondary active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Bio"}
        </button>
      </div>
    );
  }

  // LinkedIn preview
  return (
    <div
      className="w-full max-w-[360px] mx-auto group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:glow-linkedin">
        {/* LinkedIn banner */}
        <div className="h-16 gradient-linkedin relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
        </div>

        <div className="px-4 pb-4 -mt-8">
          <div className="w-16 h-16 rounded-full border-[3px] border-card bg-secondary flex items-center justify-center mb-2 shadow-md">
            <span className="text-xl font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
          </div>

          <h3 className="text-sm font-bold text-foreground">{displayName}</h3>
          {profession && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3" /> {profession}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> San Francisco Bay Area</span>
            <span className="text-primary font-medium">500+ connections</span>
          </div>

          {/* About with highlight */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">About</p>
            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 transition-colors duration-300">
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>
          </div>

          <div className="flex gap-1.5 mt-3">
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full gradient-linkedin text-primary-foreground">Connect</button>
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full border border-primary text-primary">Message</button>
          </div>

          <div className="mt-3 pt-3 border-t border-border/50">
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

      <button
        onClick={handleCopy}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-300 py-2.5 rounded-xl hover:bg-secondary active:scale-95"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Bio"}
      </button>
    </div>
  );
};

export default PlatformPreview;
