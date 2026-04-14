import { useState } from "react";
import { Copy, Check, Grid3X3, Camera, Users, MoreHorizontal, MapPin, Building2, Heart, Send, Bookmark, Home, Search, PlusSquare, Play, ChevronDown, Menu, Lock } from "lucide-react";

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
        className="w-full max-w-[280px] mx-auto group"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Phone frame - clean white like real IG */}
        <div className="rounded-[2.2rem] border-[3px] border-foreground/8 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:glow-instagram">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-2 pb-0.5 bg-card">
            <span className="text-[10px] font-semibold text-foreground">11:29</span>
            <div className="w-16 h-4 bg-foreground/10 rounded-full" />
            <div className="flex items-center gap-0.5">
              <span className="text-[8px] text-foreground/50">61%</span>
              <div className="w-5 h-2.5 rounded-sm border border-foreground/30 relative">
                <div className="absolute inset-[1px] right-[40%] bg-foreground/40 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* IG top bar: lock icon + username + chevron + icons */}
          <div className="flex items-center justify-between px-3.5 py-1.5">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-foreground/70" />
              <span className="text-sm font-bold text-foreground">{username}</span>
              <ChevronDown className="w-3 h-3 text-foreground/60" />
            </div>
            <div className="flex items-center gap-4">
              <PlusSquare className="w-5 h-5 text-foreground" />
              <Menu className="w-5 h-5 text-foreground" />
            </div>
          </div>

          {/* Profile section */}
          <div className="px-3.5 pt-1 pb-2">
            {/* Avatar + stats row */}
            <div className="flex items-center gap-3 mb-2">
              {/* Profile pic - simple circle, no gradient ring */}
              <div className="w-[72px] h-[72px] rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border/30">
                <span className="text-2xl font-semibold text-foreground/60">{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-1 justify-around">
                {[["5", "post"], ["176", "follower"], ["121", "following"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-sm font-bold text-foreground leading-tight">{num}</p>
                    <p className="text-[10px] text-foreground/60 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Name + bio, left-aligned, compact like real IG */}
            <p className="text-xs font-semibold text-foreground leading-tight">{displayName}</p>
            {profession && (
              <p className="text-[10px] text-foreground/50 mt-0">{profession}</p>
            )}

            {/* Bio text - highlighted to show this is the generated part */}
            <div className="mt-1 p-1.5 rounded-lg bg-accent/8 border border-accent/15 transition-all duration-300 group-hover:bg-accent/12 group-hover:border-accent/25">
              <p className="text-[11px] text-foreground leading-[1.4] whitespace-pre-wrap">{bio}</p>
            </div>

            {/* Edit profile button like real IG */}
            <div className="flex gap-1.5 mt-2.5">
              <button className="flex-1 bg-secondary text-secondary-foreground text-[11px] font-semibold py-1.5 rounded-lg">Modifica profilo</button>
              <button className="w-8 bg-secondary text-secondary-foreground text-[11px] font-semibold py-1.5 rounded-lg flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Story highlights row */}
            <div className="flex gap-2.5 mt-3 overflow-hidden">
              {["some pics", "a teenager", "where i go", "tiger"].map((label) => (
                <div key={label} className="flex flex-col items-center gap-0.5 flex-shrink-0 w-[56px]">
                  <div className="w-[52px] h-[52px] rounded-full border border-border/40 bg-muted/30 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/40">📷</span>
                  </div>
                  <span className="text-[9px] text-foreground/60 truncate w-full text-center">{label}</span>
                </div>
              ))}
            </div>

            {/* Tabs - grid/reels/tagged */}
            <div className="flex border-t border-border/30 mt-3">
              {[Grid3X3, Play, Users].map((Icon, i) => (
                <div key={i} className={`flex-1 flex justify-center py-2 ${i === 0 ? "border-b-2 border-foreground" : ""}`}>
                  <Icon className={`w-4 h-4 ${i === 0 ? "text-foreground" : "text-muted-foreground/30"}`} />
                </div>
              ))}
            </div>

            {/* Post grid - realistic with varied shading */}
            <div className="grid grid-cols-3 gap-[1px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`aspect-square ${i % 3 === 0 ? "bg-muted/60" : i % 2 === 0 ? "bg-muted/80" : "bg-muted/40"}`} />
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-around py-1.5 border-t border-border/20 bg-card">
            {[Home, Search, PlusSquare, Heart, Users].map((Icon, i) => (
              <Icon key={i} className={`w-5 h-5 ${i === 0 ? "text-foreground" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <div className="flex justify-center pb-1 bg-card">
            <div className="w-28 h-1 bg-foreground/12 rounded-full" />
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

  // LinkedIn preview - matches reference: banner, round avatar overlapping, name + headline + location + connections, then buttons, then About
  return (
    <div
      className="w-full max-w-[340px] mx-auto group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:glow-linkedin">
        {/* Banner - muted gradient like real LinkedIn */}
        <div className="h-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(200 15% 75%), hsl(200 20% 82%), hsl(200 10% 70%))" }}>
        </div>

        <div className="px-4 pb-4 -mt-10">
          {/* Avatar - large circle overlapping banner */}
          <div className="w-20 h-20 rounded-full border-[4px] border-card bg-muted flex items-center justify-center mb-1 shadow-sm">
            <span className="text-2xl font-bold text-foreground/60">{displayName.charAt(0).toUpperCase()}</span>
          </div>

          {/* Name row */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-foreground">{displayName}</h3>
                <span className="text-[10px] text-muted-foreground">· 2nd</span>
                {/* LinkedIn icon */}
                <div className="w-4 h-4 rounded-sm bg-[hsl(210,80%,45%)] flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">in</span>
                </div>
              </div>
              {profession && (
                <p className="text-xs text-foreground/70 mt-0.5 leading-snug">{profession}</p>
              )}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                <MapPin className="w-2.5 h-2.5" />
                <span>New York, United States</span>
                <span className="mx-0.5">·</span>
                <span className="text-primary font-medium cursor-pointer hover:underline">391 connections</span>
              </div>
              <p className="text-[10px] text-primary font-medium mt-0.5 cursor-pointer hover:underline">Contact info</p>
            </div>
            {/* Right side: company logos */}
            <div className="flex flex-col gap-1 items-end mt-1">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-[hsl(210,80%,45%)] flex items-center justify-center">
                  <span className="text-[6px] font-bold text-white">in</span>
                </div>
                <span className="text-[9px] text-muted-foreground">LinkedIn</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground/50" />
                <span className="text-[9px] text-muted-foreground">Company</span>
              </div>
            </div>
          </div>

          {/* Action buttons - rounded pills like real LI */}
          <div className="flex gap-1.5 mt-3">
            <button className="flex-1 text-[10px] font-semibold py-1.5 rounded-full bg-[hsl(210,80%,45%)] text-white">Connect</button>
            <button className="text-[10px] font-semibold py-1.5 px-3 rounded-full border border-[hsl(210,80%,45%)] text-[hsl(210,80%,45%)]">View in Recruiter</button>
            <button className="text-[10px] font-semibold py-1.5 px-3 rounded-full border border-border text-muted-foreground">More...</button>
          </div>

          {/* About section */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-xs font-bold text-foreground mb-2">About</p>
            <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-300 group-hover:bg-primary/8 group-hover:border-primary/20">
              <p className="text-[11px] text-foreground leading-[1.6] whitespace-pre-wrap">{bio}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-xs font-bold text-foreground mb-2">Experience</p>
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground leading-tight">{profession || "Your Role"}</p>
                <p className="text-[10px] text-muted-foreground">Company Name · Full-time</p>
                <p className="text-[10px] text-muted-foreground/50">Jan 2023 – Present</p>
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
