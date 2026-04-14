import { useState } from "react";
import { Copy, Check, Grid3X3, Camera, Users, MoreHorizontal, MapPin, Briefcase, Building2, Heart, MessageCircle, Send, Bookmark, Home, Search, PlusSquare, Play, Bell, Wifi, Battery, Signal } from "lucide-react";

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
  const username = name ? name.toLowerCase().replace(/\s+/g, ".") : "username";

  if (platform === "instagram") {
    return (
      <div
        className="w-full max-w-[300px] mx-auto group"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Phone frame */}
        <div className="rounded-[2.5rem] border-[3px] border-foreground/10 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:glow-instagram relative">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-2.5 pb-1 bg-card">
            <span className="text-[10px] font-semibold text-foreground">9:41</span>
            <div className="w-20 h-5 bg-foreground/10 rounded-full" />
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-foreground/60" />
              <Wifi className="w-3 h-3 text-foreground/60" />
              <Battery className="w-3.5 h-3.5 text-foreground/60" />
            </div>
          </div>

          {/* Instagram header */}
          <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border/30">
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-bold text-foreground">{username}</span>
              <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <MoreHorizontal className="w-5 h-5 text-foreground/60" />
          </div>

          {/* Profile section */}
          <div className="px-3.5 pt-3 pb-2">
            <div className="flex items-center gap-3 mb-3">
              {/* Profile pic with gradient ring */}
              <div className="w-[68px] h-[68px] rounded-full p-[2.5px] flex-shrink-0 bg-gradient-to-br from-[hsl(var(--accent))] via-[hsl(330,80%,55%)] to-[hsl(45,90%,55%)]">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-card">
                  <span className="text-xl font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex flex-1 justify-around">
                {[["42", "Posts"], ["1.2K", "Followers"], ["348", "Following"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-sm font-bold text-foreground leading-tight">{num}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Name & profession */}
            <p className="text-xs font-bold text-foreground leading-tight">{displayName}</p>
            {profession && (
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">{profession}</p>
            )}

            {/* Bio text - highlighted */}
            <div className="mt-1.5 p-2 rounded-xl bg-accent/8 border border-accent/15 transition-all duration-300 group-hover:bg-accent/12 group-hover:border-accent/25">
              <p className="text-[11px] text-foreground leading-[1.5] whitespace-pre-wrap">{bio}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 mt-2.5">
              <button className="flex-1 bg-[hsl(var(--accent))] text-primary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Follow</button>
              <button className="flex-1 bg-secondary text-secondary-foreground text-[10px] font-semibold py-1.5 rounded-lg">Message</button>
              <button className="w-8 bg-secondary text-secondary-foreground text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3" />
              </button>
            </div>

            {/* Story highlights */}
            <div className="flex gap-3 mt-3 overflow-hidden">
              {["Travel", "Food", "Work"].map((label) => (
                <div key={label} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-[52px] h-[52px] rounded-full border border-border/50 bg-muted/50 flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-t border-border/30 mt-3 pt-2">
              {[Grid3X3, Play, Users].map((Icon, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <Icon className={`w-4 h-4 ${i === 0 ? "text-foreground" : "text-muted-foreground/40"}`} />
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-[1.5px] mt-2 rounded-sm overflow-hidden">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted/80 relative group/post">
                  <div className="absolute inset-0 bg-foreground/0 group-hover/post:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover/post:opacity-100">
                    <Heart className="w-3 h-3 text-card" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav bar */}
          <div className="flex items-center justify-around py-2 border-t border-border/30 bg-card">
            {[Home, Search, PlusSquare, Heart, Users].map((Icon, i) => (
              <Icon key={i} className={`w-5 h-5 ${i === 0 ? "text-foreground" : "text-muted-foreground/40"}`} />
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-1.5 bg-card">
            <div className="w-28 h-1 bg-foreground/15 rounded-full" />
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
      className="w-full max-w-[340px] mx-auto group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:glow-linkedin">
        {/* LinkedIn top bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-card border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">in</span>
            </div>
            <div className="w-28 h-6 rounded bg-muted/60 flex items-center px-2">
              <Search className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[9px] text-muted-foreground/50 ml-1">Search</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[Home, Users, MessageCircle, Bell].map((Icon, i) => (
              <Icon key={i} className={`w-4 h-4 ${i === 0 ? "text-foreground" : "text-muted-foreground/40"}`} />
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(210,80%,45%)] to-[hsl(var(--primary))] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent" />
          {/* Abstract shapes */}
          <div className="absolute top-2 right-6 w-16 h-16 rounded-full bg-white/5" />
          <div className="absolute bottom-1 left-10 w-10 h-10 rounded-full bg-white/5" />
        </div>

        <div className="px-4 pb-4 -mt-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-[4px] border-card bg-secondary flex items-center justify-center mb-1.5 shadow-md">
            <span className="text-2xl font-bold text-foreground">{displayName.charAt(0).toUpperCase()}</span>
          </div>

          <h3 className="text-sm font-bold text-foreground leading-tight">{displayName}</h3>
          {profession && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              {profession}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> San Francisco Bay Area</span>
            <span>·</span>
            <span className="text-primary font-medium cursor-pointer hover:underline">500+ connections</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 mt-2.5">
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Connect
            </button>
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full border border-primary text-primary">Message</button>
            <button className="px-3 text-[10px] font-semibold py-1.5 rounded-full border border-border text-muted-foreground">More</button>
          </div>

          {/* About section - highlighted */}
          <div className="mt-3.5 pt-3 border-t border-border/30">
            <p className="text-[11px] font-bold text-foreground mb-1.5">About</p>
            <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-300 group-hover:bg-primary/8 group-hover:border-primary/20">
              <p className="text-[11px] text-foreground leading-[1.6] whitespace-pre-wrap">{bio}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-[11px] font-bold text-foreground mb-2">Experience</p>
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-muted-foreground/60" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground leading-tight">{profession || "Your Role"}</p>
                <p className="text-[10px] text-muted-foreground">Company Name · Full-time</p>
                <p className="text-[10px] text-muted-foreground/60">Jan 2023 – Present · 1 yr 3 mos</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-[11px] font-bold text-foreground mb-1.5">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {["Leadership", "Strategy", "Communication"].map((skill) => (
                <span key={skill} className="text-[9px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">{skill}</span>
              ))}
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
