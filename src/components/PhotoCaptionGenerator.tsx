import { useRef, useState } from "react";
import { Loader2, Upload, Sparkles, Wand2, ImageIcon, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CaptionCard from "./CaptionCard";

type CaptionPlatform = "instagram" | "linkedin";
type CaptionTone = "Witty" | "Inspirational" | "Bold" | "Gen Z" | "Heartfelt" | "Minimal";

const TONES: { value: CaptionTone; emoji: string; hint: string }[] = [
  { value: "Witty", emoji: "😏", hint: "clever wordplay & humor" },
  { value: "Inspirational", emoji: "✨", hint: "uplifting & motivational" },
  { value: "Bold", emoji: "🔥", hint: "confident & punchy" },
  { value: "Gen Z", emoji: "💅", hint: "slang & internet lingo" },
  { value: "Heartfelt", emoji: "💛", hint: "warm & emotional" },
  { value: "Minimal", emoji: "🤍", hint: "short & understated" },
];

const toneInstruction = (tone: CaptionTone): string => {
  switch (tone) {
    case "Witty":
      return "Voice: WITTY — use clever wordplay, double meanings, light humor and a punchline. Avoid being corny.";
    case "Inspirational":
      return "Voice: INSPIRATIONAL — uplifting, motivational, evocative imagery, end on a forward-looking note.";
    case "Bold":
      return "Voice: BOLD — confident, punchy, declarative sentences, no hedging, strong verbs.";
    case "Gen Z":
      return "Voice: GEN Z — use Gen Z slang and internet lingo like 'slay', 'no cap', 'lowkey', 'it's giving', 'main character energy', 'ate and left no crumbs', 'understood the assignment', 'periodt'. Sound like a trendy Gen Z person — playful, ironic, very online.";
    case "Heartfelt":
      return "Voice: HEARTFELT — warm, emotional, sincere, gentle, gratitude-tinged.";
    case "Minimal":
      return "Voice: MINIMAL — short, understated, lowercase where natural, max 1 emoji, no filler.";
  }
};

interface InstagramResult {
  witty: string;
  professional: string;
  casual: string;
  hashtags: string;
  tags: string;
  alt_text: string;
}

interface LinkedInResult {
  professional_post: string;
  storytelling_post: string;
  short_post: string;
  hashtags: string;
  tags: string;
  alt_text: string;
}

const PhotoCaptionGenerator = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [contextNote, setContextNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState<CaptionPlatform>("instagram");
  const [tone, setTone] = useState<CaptionTone>("Witty");
  const [igResult, setIgResult] = useState<InstagramResult | null>(null);
  const [liResult, setLiResult] = useState<LinkedInResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be smaller than 4MB.");
      return;
    }
    setError("");
    setIgResult(null);
    setLiResult(null);
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImageData(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setImageData(null);
    setImageName("");
    setIgResult(null);
    setLiResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchPlatform = (p: CaptionPlatform) => {
    setPlatform(p);
    // clear results when switching so the user re-generates for that platform
    setIgResult(null);
    setLiResult(null);
    setError("");
  };

  const generate = async () => {
    const apiKey = localStorage.getItem("groq_api_key");
    if (!apiKey) {
      setError("Please add your Groq API key first (click the API Key button in the header).");
      return;
    }
    if (!imageData) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setIgResult(null);
    setLiResult(null);

    const instagramPrompt = `You are an expert Instagram copywriter. Analyze the provided image carefully (people, mood, setting, objects, colors, vibe). Respond ONLY with valid JSON, no markdown, no commentary. Use this EXACT schema:
{
  "witty": "a clever, punchy Instagram caption with wordplay (max 150 chars, 2-3 emojis)",
  "professional": "a polished Instagram caption suitable for a creator/brand page (max 150 chars, 1-2 emojis)",
  "casual": "a relaxed, friendly Instagram caption like a real person posting to friends (max 150 chars, with emojis)",
  "hashtags": "20-25 highly relevant Instagram hashtags space-separated, mix of niche + popular, all starting with #",
  "tags": "comma-separated suggestions of who/what to tag on Instagram (people, brands, locations visible). Use @handle format where it looks like one (e.g. '@nike, your friend, @mumbai')",
  "alt_text": "a concise descriptive alt text for accessibility (1-2 sentences, no emojis)"
}`;

    const linkedinPrompt = `You are an expert LinkedIn personal-branding copywriter. Analyze the provided image carefully (note achievements, certificates, events, people, brands, settings). Respond ONLY with valid JSON, no markdown, no commentary. Use this EXACT schema:
{
  "professional_post": "a polished LinkedIn post (4-6 short paragraphs separated by \\n\\n, hook + context + insight + CTA, professional tone)",
  "storytelling_post": "a narrative-style LinkedIn post (5-7 short paragraphs separated by \\n\\n, personal story arc, emotional hook, lessons learned, ends with reflective question)",
  "short_post": "a concise punchy LinkedIn post (2-3 short paragraphs separated by \\n\\n, hook + key takeaway + CTA)",
  "hashtags": "8-12 relevant professional LinkedIn hashtags space-separated, all starting with #",
  "tags": "comma-separated suggestions of who/what to tag on LinkedIn (companies, mentors, organizations, event hosts visible). Use @handle format where it looks like one (e.g. '@Microsoft, your manager, the event organizer')",
  "alt_text": "a concise descriptive alt text for accessibility (1-2 sentences, no emojis)"
}`;

    const baseSystemPrompt = platform === "instagram" ? instagramPrompt : linkedinPrompt;
    const contextInstruction = contextNote.trim() ? `\n\nUSER CONTEXT: "${contextNote.trim()}"\nIncorporate this context naturally into the captions/posts. Make it feel authentic and relevant.` : "";
    const systemPrompt = `${baseSystemPrompt}${contextInstruction}\n\n${toneInstruction(tone)}\nApply this voice consistently to EVERY text field in the JSON (captions/posts). Do NOT change the JSON keys or schema.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                { type: "image_url", image_url: { url: imageData } },
              ],
            },
          ],
          temperature: 0.85,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("No response from the API.");

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Could not parse AI response.");
        parsed = JSON.parse(match[0]);
      }

      if (platform === "instagram") setIgResult(parsed as InstagramResult);
      else setLiResult(parsed as LinkedInResult);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isInstagram = platform === "instagram";
  const gradient = isInstagram
    ? "from-pink-500 via-fuchsia-500 to-purple-600"
    : "from-sky-600 via-blue-600 to-indigo-700";
  const accentBg = isInstagram ? "bg-pink-500/10 text-pink-600 dark:text-pink-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  const dashedBorder = isInstagram ? "border-fuchsia-300 dark:border-fuchsia-700 hover:border-fuchsia-500 hover:bg-fuchsia-500/5" : "border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:bg-blue-500/5";
  const uploadIconBg = isInstagram ? "from-pink-500 to-fuchsia-500" : "from-sky-500 to-blue-600";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="animate-fade-in-up text-center space-y-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${accentBg}`}>
          <Sparkles className="w-3 h-3" /> AI Vision Powered
        </div>
        <h2 className={`text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          AI Photo Caption Generator
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Upload any photo or certificate. Get tailored captions for{" "}
          <span className="font-semibold text-foreground">Instagram</span> or{" "}
          <span className="font-semibold text-foreground">LinkedIn</span> in seconds.
        </p>
      </div>

      {/* Platform Toggle */}
      <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "100ms" }}>
        <div className="inline-flex rounded-2xl glass p-1.5 gap-1">
          <button
            onClick={() => switchPlatform("instagram")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              isInstagram
                ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            📸 Instagram
          </button>
          <button
            onClick={() => switchPlatform("linkedin")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              !isInstagram
                ? "bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            💼 LinkedIn
          </button>
        </div>
      </div>

      {/* Tone Selector */}
      <div className="animate-fade-in-up space-y-3" style={{ animationDelay: "130ms" }}>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          🎭 Pick a tone
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {TONES.map((t) => {
            const active = tone === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                title={t.hint}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                  active
                    ? `${
                        isInstagram
                          ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 border-transparent"
                          : "bg-gradient-to-r from-sky-600 to-blue-700 border-transparent"
                      } text-white shadow-lg scale-105`
                    : "bg-background/60 border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:scale-[1.03]"
                }`}
              >
                <span className="mr-1">{t.emoji}</span>
                {t.value}
              </button>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          {TONES.find((t) => t.value === tone)?.hint}
        </p>
      </div>

      {/* Context Note */}
      <div className="animate-fade-in-up space-y-2" style={{ animationDelay: "140ms" }}>
        <div className="flex items-center justify-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Add Context (Optional)
          </p>
        </div>
        <Textarea
          value={contextNote}
          onChange={(e) => setContextNote(e.target.value)}
          placeholder={isInstagram 
            ? "e.g., 'Just got promoted at work!' or 'Diwali trip with family' — helps captions feel personal" 
            : "e.g., 'Just completed my AWS certification' or 'Speaking at TechConf 2024' — helps posts feel authentic"}
          className="min-h-[80px] resize-none bg-background/60 border-border/50 focus:border-primary/50 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/60"
        />
        <p className="text-center text-[11px] text-muted-foreground">
          {contextNote.trim() ? `✨ AI will weave "${contextNote.trim().slice(0, 30)}${contextNote.trim().length > 30 ? '...' : ''}" into your captions` : "Leave empty for general captions based on image alone"}
        </p>
      </div>

      <div className="animate-fade-in-up glass-strong rounded-2xl p-5 sm:p-7 space-y-5" style={{ animationDelay: "150ms" }}>
        {!imageData ? (
          <label
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 sm:p-12 cursor-pointer transition-all duration-300 group ${dashedBorder}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${uploadIconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-foreground">Click or drag an image here</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 4MB</p>
            </div>
          </label>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-muted/30">
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={imageData} alt="Upload preview" className="w-full max-h-96 object-contain bg-black/5" />
            <div className="px-4 py-2 text-xs text-muted-foreground flex items-center gap-1.5 bg-background/50">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="truncate">{imageName}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="animate-fade-in-up text-sm text-destructive font-medium bg-destructive/10 px-4 py-2.5 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        <Button
          onClick={generate}
          disabled={loading || !imageData}
          size="lg"
          className={`w-full text-base font-bold py-6 bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="ml-2">Reading your image...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span className="ml-2">Generate {isInstagram ? "Instagram Captions" : "LinkedIn Posts"}</span>
              <Sparkles className="w-4 h-4 ml-1 animate-bounce-subtle" />
            </>
          )}
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-fade-in">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border border-border/50 overflow-hidden">
              <div className="shimmer h-24" />
            </div>
          ))}
        </div>
      )}

      {/* Instagram Results */}
      {isInstagram && igResult && !loading && (
        <div className="space-y-6">
          <div className="animate-fade-in-up text-center space-y-1">
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              Your Instagram Captions Are Ready! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">Tap any card to copy</p>
          </div>

          <div className="space-y-3">
            <CaptionCard label="Witty" emoji="😏" content={igResult.witty} accent="pink" delay={0} />
            <CaptionCard label="Professional" emoji="💼" content={igResult.professional} accent="purple" delay={80} />
            <CaptionCard label="Casual" emoji="😎" content={igResult.casual} accent="amber" delay={160} />
          </div>

          <div className="space-y-1 pt-2">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              ✨ Instagram Toolkit
            </h4>
          </div>
          <div className="space-y-3">
            <CaptionCard label="Hashtags" emoji="#️⃣" content={igResult.hashtags} accent="pink" multiline delay={240} />
            <CaptionCard label="Whom To Tag" emoji="🏷️" content={igResult.tags} accent="purple" delay={320} />
            <CaptionCard label="Image Alt Text" emoji="♿" content={igResult.alt_text} accent="emerald" delay={400} />
          </div>
        </div>
      )}

      {/* LinkedIn Results */}
      {!isInstagram && liResult && !loading && (
        <div className="space-y-6">
          <div className="animate-fade-in-up text-center space-y-1">
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              Your LinkedIn Posts Are Ready! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">Tap any card to copy</p>
          </div>

          <div className="space-y-3">
            <CaptionCard
              label="Professional Post"
              emoji="💼"
              content={liResult.professional_post}
              accent="blue"
              multiline
              delay={0}
            />
            <CaptionCard
              label="Storytelling Post"
              emoji="📖"
              content={liResult.storytelling_post}
              accent="purple"
              multiline
              delay={80}
            />
            <CaptionCard
              label="Short Post"
              emoji="⚡"
              content={liResult.short_post}
              accent="amber"
              multiline
              delay={160}
            />
          </div>

          <div className="space-y-1 pt-2">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              📣 LinkedIn Toolkit
            </h4>
          </div>
          <div className="space-y-3">
            <CaptionCard label="Hashtags" emoji="#️⃣" content={liResult.hashtags} accent="blue" multiline delay={240} />
            <CaptionCard label="Whom To Tag" emoji="🏷️" content={liResult.tags} accent="purple" delay={320} />
            <CaptionCard label="Image Alt Text" emoji="♿" content={liResult.alt_text} accent="emerald" delay={400} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptionGenerator;
