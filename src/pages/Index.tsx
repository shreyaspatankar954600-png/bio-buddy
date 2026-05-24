import { useState, useEffect } from "react";
import { Loader2, Sparkles, Wand2, ArrowDown, FileText, Camera, RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformPreview from "@/components/PlatformPreview";
import Testimonials from "@/components/Testimonials";
import FloatingParticles from "@/components/FloatingParticles";
import PhotoCaptionGenerator from "@/components/PhotoCaptionGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { callGenerate } from "@/lib/generate";

type Platform = "instagram" | "linkedin";
type Mode = "bio" | "caption";
type Tone = "Professional" | "Casual" | "Funny" | "Inspirational" | "Gen Z";
type Length = "short" | "medium" | "long";

const toneEmojis: Record<Tone, string> = {
  Professional: "💼",
  Casual: "😎",
  Funny: "😂",
  Inspirational: "✨",
  "Gen Z": "💅",
};

const toneLabels: Record<Tone, [string, string, string]> = {
  Professional: ["Professional Edge", "Conversational", "Bold & Punchy"],
  Casual: ["Easy-going", "Friendly Storyteller", "Short & Sweet"],
  Funny: ["Witty", "Self-deprecating", "One-liner"],
  Inspirational: ["Uplifting", "Story-driven", "Punchy Mantra"],
  "Gen Z": ["Slay Mode", "Main Character", "No Cap"],
};

const lengthMap: Record<Platform, Record<Length, number>> = {
  instagram: { short: 80, medium: 150, long: 220 },
  linkedin: { short: 150, medium: 300, long: 500 },
};

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState<Mode>("bio");
  const isMobile = useIsMobile();

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("medium");
  const [useEmojis, setUseEmojis] = useState(true);
  const [extraContext, setExtraContext] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [shake, setShake] = useState(false);

  const [bios, setBios] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [regenIdx, setRegenIdx] = useState<number | null>(null);
  const [error, setError] = useState("");

  const charLimit = lengthMap[platform][length];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const buildPrompt = (variantNote = "") => {
    const toneInstruction =
      tone === "Gen Z"
        ? "Tone: Gen Z — use Gen Z slang ('slay', 'no cap', 'lowkey', 'main character energy', 'it's giving', 'bestie', 'periodt'). Sound chronically online."
        : `Tone: ${tone}.`;
    const emojiPolicy = useEmojis
      ? "Sprinkle 1-3 tasteful, relevant emojis naturally."
      : "STRICT: Do NOT use any emojis, emoticons, or pictographs. Plain text only.";
    const ctx = extraContext.trim()
      ? ` Weave in this context naturally: "${extraContext.trim()}".`
      : "";
    const nicheLine = niche.trim() ? ` Role/Niche: ${niche.trim()}.` : "";
    const kw = keywords.trim() ? ` Keywords: ${keywords.trim()}.` : "";

    return `Generate EXACTLY 3 distinct ${platform} bio variations IN ENGLISH ONLY for ${name}, a ${profession}.${nicheLine}${kw} ${toneInstruction} ${emojiPolicy} Each bio MUST stay under ${charLimit} characters.${ctx}${variantNote}

For each bio also write ONE concise feedback line (max 12 words) starting with one of: 💡, ✅, ⚡ — like "💡 Strong hook but could add a CTA" or "✅ Great keyword density for LinkedIn search".

Respond ONLY with valid JSON, no markdown:
{
  "bios": ["bio1", "bio2", "bio3"],
  "feedback": ["feedback1", "feedback2", "feedback3"]
}`;
  };

  const parseJSON = (text: string): { bios: string[]; feedback: string[] } => {
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Could not parse AI response.");
      parsed = JSON.parse(m[0]);
    }
    const bios = Array.isArray(parsed.bios) ? parsed.bios.slice(0, 3) : [];
    const feedback = Array.isArray(parsed.feedback)
      ? parsed.feedback.slice(0, 3)
      : ["", "", ""];
    while (feedback.length < bios.length) feedback.push("");
    if (bios.length === 0) throw new Error("No bios returned.");
    return { bios, feedback };
  };

  const generate = async () => {
    if (!name.trim() || !profession.trim()) {
      setError("Please fill in your name and role/profession.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setLoading(true);
    setError("");
    setBios([]);
    setFeedback([]);

    try {
      const text = await callGenerate({
        messages: [{ role: "user", content: buildPrompt() }],
        model: "llama-3.1-8b-instant",
        temperature: tone === "Gen Z" ? 1.0 : 0.9,
        max_tokens: 900,
        response_format: { type: "json_object" },
      });
      const { bios, feedback } = parseJSON(text);
      setBios(bios);
      setFeedback(feedback);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const regenerateOne = async (i: number) => {
    setRegenIdx(i);
    setError("");
    try {
      const variantNote = ` Generate a FRESH variation — different angle / opening hook than typical. This is variation refresh #${Date.now() % 1000}.`;
      const text = await callGenerate({
        messages: [{ role: "user", content: buildPrompt(variantNote) }],
        model: "llama-3.1-8b-instant",
        temperature: 1.0,
        max_tokens: 900,
        response_format: { type: "json_object" },
      });
      const { bios: newBios, feedback: newFb } = parseJSON(text);
      // Pick the first regenerated bio to replace position i
      setBios((prev) => prev.map((b, idx) => (idx === i ? newBios[0] ?? b : b)));
      setFeedback((prev) => prev.map((f, idx) => (idx === i ? newFb[0] ?? f : f)));
    } catch (err: any) {
      setError(err.message || "Regeneration failed.");
    } finally {
      setRegenIdx(null);
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium dark background with purple radial glow */}
      <div className="fixed inset-0 bg-background" />
      <div
        className="fixed inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(270 80% 50% / 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, hsl(210 80% 50% / 0.18), transparent 60%)",
        }}
      />
      <FloatingParticles platform={platform} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

        <main
          className={`flex-1 w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8 transition-[max-width] duration-300 ${
            mode === "caption" ? "max-w-7xl" : "max-w-4xl"
          }`}
        >
          {/* Mode Toggle */}
          <div className="animate-fade-in-down flex justify-center">
            <div className="inline-flex rounded-2xl glass-strong p-1.5 gap-1 shadow-md">
              <button
                onClick={() => setMode("bio")}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  mode === "bio"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Bio Generator
              </button>
              <button
                onClick={() => setMode("caption")}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  mode === "caption"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Camera className="w-4 h-4" />
                Photo Caption
              </button>
            </div>
          </div>

          {mode === "caption" ? (
            <PhotoCaptionGenerator />
          ) : (
            <>
              {/* Hero */}
              <div className="animate-fade-in-up text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                  <Sparkles className="w-3 h-3" /> Powered by AI
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                  Generate scroll-stopping bios <span className="text-primary">in seconds</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Three AI bios for <span className="font-semibold text-foreground">Instagram</span> or{" "}
                  <span className="font-semibold text-foreground">LinkedIn</span> — free, no signup.
                </p>
              </div>

              {/* Platform Toggle (pill with sliding active) */}
              <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "100ms" }}>
                <div className="inline-flex rounded-full glass p-1 gap-1">
                  {(["instagram", "linkedin"] as Platform[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize ${
                        platform === p
                          ? p === "instagram"
                            ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg"
                            : "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p === "instagram" ? "📸 Instagram" : "💼 LinkedIn"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div
                className={`animate-fade-in-up glass-strong rounded-2xl p-5 sm:p-7 space-y-5 ${
                  shake ? "animate-shake" : ""
                }`}
                style={{ animationDelay: "200ms" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`focus-visible:ring-primary ${shake && !name.trim() ? "border-destructive" : ""}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profession" className="text-xs font-semibold text-muted-foreground">Profession / Role</Label>
                    <Input
                      id="profession"
                      placeholder="e.g. Software Engineer"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className={`focus-visible:ring-primary ${shake && !profession.trim() ? "border-destructive" : ""}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="niche" className="text-xs font-semibold text-muted-foreground">Your Role / Niche</Label>
                    <Input
                      id="niche"
                      placeholder="fitness coach, wedding photographer, SaaS founder"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="keywords" className="text-xs font-semibold text-muted-foreground">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="travel, mindfulness, Mumbai"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Tone</Label>
                    <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                      <SelectTrigger className="focus:ring-primary"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["Professional", "Casual", "Funny", "Inspirational", "Gen Z"] as Tone[]).map((t) => (
                          <SelectItem key={t} value={t}>{toneEmojis[t]} {t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Bio Length (max {charLimit} chars)</Label>
                    <div className="inline-flex w-full rounded-lg bg-secondary p-1 gap-1">
                      {(["short", "medium", "long"] as Length[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLength(l)}
                          className={`flex-1 px-2 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                            length === l ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="extra-context" className="text-xs font-semibold text-muted-foreground">
                    Anything specific to add? <span className="font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="extra-context"
                    placeholder={
                      platform === "linkedin"
                        ? "e.g., 'Ex-Google, now building my own SaaS'..."
                        : "e.g., 'Dog mom of 2, currently in Bali'..."
                    }
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value.slice(0, 300))}
                    maxLength={300}
                    className="min-h-[72px] resize-none focus-visible:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground text-right">{extraContext.length}/300</p>
                </div>

                <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
                  <Label htmlFor="emoji-toggle" className="text-sm font-semibold cursor-pointer">
                    Add Emojis 🎨
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {useEmojis ? "Bios will include tasteful emojis" : "Plain text — no emojis"}
                    </span>
                  </Label>
                  <Switch id="emoji-toggle" checked={useEmojis} onCheckedChange={setUseEmojis} />
                </div>

                {error && (
                  <div className="animate-fade-in-up flex items-start gap-2 text-sm text-destructive font-medium bg-destructive/10 px-4 py-2.5 rounded-xl border border-destructive/20">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={generate} className="text-xs underline shrink-0">Try Again</button>
                  </div>
                )}

                <Button
                  onClick={generate}
                  disabled={loading}
                  size="lg"
                  className="w-full min-h-12 text-base font-bold py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-primary/30 hover:shadow-xl"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span className="ml-2 animate-pulse">Generating...</span></>
                  ) : (
                    <><Sparkles className="w-5 h-5" /><span className="ml-2">Generate My Bio</span></>
                  )}
                </Button>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/50 overflow-hidden">
                      <div className="shimmer h-[280px]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {bios.length > 0 && !loading && (
                <div className="space-y-6">
                  <div className="animate-fade-in-up text-center space-y-1">
                    <h3 className="text-2xl font-bold text-foreground">Your Bios Are Ready 🎉</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      Three {tone} variations
                      <ArrowDown className="w-3.5 h-3.5 animate-bounce-subtle" />
                    </p>
                  </div>

                  {isMobile ? (
                    <Carousel opts={{ align: "center", loop: false }} className="w-full">
                      <CarouselContent className="-ml-2">
                        {bios.map((bio, i) => (
                          <CarouselItem key={i} className="pl-2 basis-[88%]">
                            <BioResultCard
                              bio={bio} index={i} charLimit={charLimit} platform={platform}
                              name={name} profession={profession}
                              label={toneLabels[tone][i] || `Version ${i + 1}`}
                              feedback={feedback[i] || ""}
                              loading={regenIdx === i}
                              onRegenerate={() => regenerateOne(i)}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <p className="text-center text-xs text-muted-foreground mt-3">← Swipe →</p>
                    </Carousel>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch auto-rows-fr">
                      {bios.map((bio, i) => (
                        <BioResultCard
                          key={i}
                          bio={bio} index={i} charLimit={charLimit} platform={platform}
                          name={name} profession={profession}
                          label={toneLabels[tone][i] || `Version ${i + 1}`}
                          feedback={feedback[i] || ""}
                          loading={regenIdx === i}
                          onRegenerate={() => regenerateOne(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Social Proof */}
              <Testimonials />
            </>
          )}

          {/* Anchored info sections */}
          <section id="how-it-works" className="glass rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-foreground">How it works</h3>
            <p className="text-sm text-muted-foreground">
              1. Pick your platform. 2. Add your name, role and tone. 3. Hit generate — three AI-crafted bios appear in seconds. Regenerate any single one until it feels just right.
            </p>
          </section>
          <section id="privacy" className="glass rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-foreground">Privacy</h3>
            <p className="text-sm text-muted-foreground">
              We don't store your inputs. Bios are generated server-side via secure API keys and returned directly to your browser.
            </p>
          </section>
          <section id="terms" className="glass rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-foreground">Terms</h3>
            <p className="text-sm text-muted-foreground">
              BioDraft is provided as-is, free for personal and professional use. Generated content is yours to keep.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

interface BioResultCardProps {
  bio: string;
  index: number;
  charLimit: number;
  platform: Platform;
  name: string;
  profession: string;
  label: string;
  feedback: string;
  loading: boolean;
  onRegenerate: () => void;
}

const BioResultCard = ({
  bio, index, charLimit, platform, name, profession, label, feedback, loading, onRegenerate,
}: BioResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const len = bio.length;
  const pct = len / charLimit;
  const badgeClass =
    pct > 1
      ? "bg-destructive/15 text-destructive border-destructive/30"
      : pct > 0.85
      ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
      : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";

  const copy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in-up h-full flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur p-5 gap-3 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 relative"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {loading && (
        <div className="absolute inset-0 rounded-2xl bg-background/70 backdrop-blur-sm flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Version {index + 1}
          </p>
          <p className="text-sm font-bold text-foreground">{label}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRegenerate}
            disabled={loading}
            title="Regenerate this bio"
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={copy}
            title="Copy"
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-secondary/40 border border-border/40 p-3.5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {bio}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${badgeClass}`}>
          {len} / {charLimit}
        </span>
        <span className="text-[11px] text-muted-foreground capitalize">{platform}</span>
      </div>

      {feedback && (
        <p className="text-[11px] text-muted-foreground italic border-l-2 border-primary/40 pl-2">
          {feedback}
        </p>
      )}

      <Button onClick={copy} size="sm" className="w-full min-h-10 mt-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
        {copied ? <><Check className="w-4 h-4" /> Copied!</> : <>Use This</>}
      </Button>

      {/* Hidden helper to surface name/profession in DOM for SEO context */}
      <span className="sr-only">
        Bio for {name}, {profession} on {platform}
      </span>
    </div>
  );
};

export default Index;
