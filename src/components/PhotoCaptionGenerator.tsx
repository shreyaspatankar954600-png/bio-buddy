import { useRef, useState } from "react";
import { Loader2, Upload, Sparkles, Wand2, ImageIcon, X, MessageSquare, Eye, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CaptionCard from "./CaptionCard";
import { InstagramPreview, LinkedInPreview } from "./CaptionPlatformPreview";

type CaptionPlatform = "instagram" | "linkedin";
type CaptionTone = "Professional" | "Witty" | "Inspirational" | "Bold" | "Gen Z" | "Heartfelt" | "Minimal";

const TONES: { value: CaptionTone; emoji: string; hint: string }[] = [
  { value: "Professional", emoji: "💼", hint: "polished & business-ready" },
  { value: "Witty", emoji: "😏", hint: "clever wordplay & humor" },
  { value: "Inspirational", emoji: "✨", hint: "uplifting & motivational" },
  { value: "Bold", emoji: "🔥", hint: "confident & punchy" },
  { value: "Gen Z", emoji: "💅", hint: "slang & internet lingo" },
  { value: "Heartfelt", emoji: "💛", hint: "warm & emotional" },
  { value: "Minimal", emoji: "🤍", hint: "short & understated" },
];

// Strip emoji + most pictographs from a string (used when emoji toggle is OFF)
const stripEmojis = (s: string): string =>
  s
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\u200d\uFE0F]/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.!?;:])/g, "$1")
    .trim();

const toneInstruction = (tone: CaptionTone): string => {
  switch (tone) {
    case "Professional":
      return `TONE: PROFESSIONAL 💼
- Polished, business-ready, clear, confident. Industry-aware vocabulary.
- Structured sentences, credible voice, focus on insight, value, or achievement.
- Avoid slang, avoid being overly casual. Active voice. End with a thoughtful CTA or reflection.
- Example vibe: "Proud to share a milestone from this week's launch — a reminder that consistent execution compounds."`;
    case "Witty":
      return `TONE: WITTY 😏
- Use clever wordplay, double meanings, light humor, and a punchline.
- Be cheeky and a little sarcastic. Avoid being corny.
- Example vibe: "Plot twist: I peaked at the snack table 🥨"`;
    case "Inspirational":
      return `TONE: INSPIRATIONAL ✨
- Uplifting, motivational, evocative imagery, end on a forward-looking note.
- Use words like "rise", "become", "journey", "light", "begin".
- Example vibe: "Some chapters are quiet, but they're shaping the loudest version of you ✨"`;
    case "Bold":
      return `TONE: BOLD 🔥
- Confident, punchy, declarative sentences. NO hedging. Strong verbs.
- Short sentences. Maximum impact.
- Example vibe: "I don't chase. I attract. Watch me."`;
    case "Gen Z":
      return `TONE: GEN Z 💅 (CRITICAL — THIS IS NON-NEGOTIABLE)
- You MUST sound like a chronically-online Gen Z (born 1997-2012). NOT millennial. NOT corporate. NOT polished.
- REQUIRED slang in EVERY caption/post (use at least 3-5 of these): "slay", "no cap", "lowkey", "highkey", "it's giving ___", "main character energy", "ate and left no crumbs", "understood the assignment", "periodt", "bestie", "the way that ___", "not me ___ing", "I fear ___", "delulu", "rent free", "ick", "iykyk", "hits different", "vibe check", "girl math", "boy math", "we love to see it", "say less", "absolutely sending me".
- Use lowercase often. Drop punctuation casually. Use emojis like 💅✨😭🫶🔥🎀 NOT corporate emojis.
- DO NOT write professional, polished, or motivational copy. If it sounds like a brand wrote it, START OVER.
- Example vibe Instagram: "not me serving looks at the grocery store 💅 it's giving main character no cap ✨"
- Example vibe LinkedIn: "ok bestie hear me out — landed the internship and I'm lowkey shaking 😭 understood the assignment fr fr. shoutout to my mentor for not letting me be delulu about my potential 🫶"
- IGNORE any field labels like "professional" or "polished" in the schema below — TONE OVERRIDES THEM. Every field must sound Gen Z.`;
    case "Heartfelt":
      return `TONE: HEARTFELT 💛
- Warm, emotional, sincere, gentle, gratitude-tinged.
- Use soft language. Mention feelings explicitly.
- Example vibe: "Held this moment a little longer today. Grateful beyond words 💛"`;
    case "Minimal":
      return `TONE: MINIMAL 🤍
- Short. Understated. Lowercase where natural. Max 1 emoji. No filler.
- Example vibe: "soft days. quiet wins. 🤍"`;
  }
};

interface InstagramResult {
  option_1: string;
  option_2: string;
  option_3: string;
  hashtags: string;
  tags: string;
  alt_text: string;
}

interface LinkedInResult {
  option_1: string;
  option_2: string;
  option_3: string;
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
  const [tone, setTone] = useState<CaptionTone>("Professional");
  const [useEmojis, setUseEmojis] = useState<boolean>(true);
  const [igResult, setIgResult] = useState<InstagramResult | null>(null);
  const [liResult, setLiResult] = useState<LinkedInResult | null>(null);
  const [igVariant, setIgVariant] = useState<"option_1" | "option_2" | "option_3">("option_1");
  const [liVariant, setLiVariant] = useState<"option_1" | "option_2" | "option_3">("option_1");
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

    // Tone-aware prompts: schema fields describe LENGTH/FORMAT only.
    // The tone block (placed at the top of systemPrompt) governs voice.
    const instagramPrompt = `You are an expert Instagram copywriter. Analyze the provided image carefully (people, mood, setting, objects, colors, vibe).

Generate three distinct Instagram caption variations based on the image and any user context.
ALL THREE variations MUST strictly follow the ${tone} tone defined above — no exceptions.
- option_1 should be a STANDARD caption (balanced length, ~100-150 chars).
- option_2 should be a NARRATIVE / story-based approach (slightly longer, sets a small scene or moment, max 150 chars).
- option_3 should be CONCISE / PUNCHY (short, max ~80 chars, high impact).
All three must maintain the ${tone} style and feel clearly different from each other in structure — but identical in voice.

Respond ONLY with valid JSON, no markdown, no commentary. Use this EXACT schema:
{
  "option_1": "Standard ${tone} Instagram caption (max 150 chars).",
  "option_2": "Narrative / story-based ${tone} Instagram caption (max 150 chars).",
  "option_3": "Concise punchy ${tone} Instagram caption (max ~80 chars).",
  "hashtags": "20-25 highly relevant Instagram hashtags space-separated, mix of niche + popular, all starting with #",
  "tags": "comma-separated suggestions of who/what to tag on Instagram (people, brands, locations visible). Use @handle format where it looks like one (e.g. '@nike, your friend, @mumbai')",
  "alt_text": "a concise descriptive alt text for accessibility (1-2 sentences, no emojis, neutral tone for accessibility)"
}`;

    const linkedinPrompt = `You are an expert LinkedIn personal-branding copywriter. Analyze the provided image carefully (note achievements, certificates, events, people, brands, settings).

Generate three distinct LinkedIn post variations based on the image and any user context.
ALL THREE variations MUST strictly follow the ${tone} tone defined above — no exceptions.
- option_1 should be a STANDARD post (4-6 short paragraphs separated by \\n\\n, hook + context + insight + CTA).
- option_2 should be a NARRATIVE / story-based approach (5-7 short paragraphs separated by \\n\\n, personal story arc, ends with a reflective question).
- option_3 should be CONCISE / PUNCHY (2-3 short paragraphs separated by \\n\\n, hook + key takeaway + CTA).
All three must maintain the ${tone} style — only the structure/length differs.

Respond ONLY with valid JSON, no markdown, no commentary. Use this EXACT schema:
{
  "option_1": "Standard ${tone} LinkedIn post.",
  "option_2": "Narrative / story-based ${tone} LinkedIn post.",
  "option_3": "Concise punchy ${tone} LinkedIn post.",
  "hashtags": "8-12 relevant LinkedIn hashtags space-separated, all starting with #",
  "tags": "comma-separated suggestions of who/what to tag on LinkedIn (companies, mentors, organizations, event hosts visible). Use @handle format where it looks like one (e.g. '@Microsoft, your manager, the event organizer')",
  "alt_text": "a concise descriptive alt text for accessibility (1-2 sentences, no emojis, neutral tone for accessibility)"
}`;

    const baseSystemPrompt = platform === "instagram" ? instagramPrompt : linkedinPrompt;
    const contextInstruction = contextNote.trim() ? `\n\nUSER CONTEXT (real backstory to weave in): "${contextNote.trim()}"` : "";
    const emojiInstruction = platform === "linkedin"
      ? (useEmojis
          ? `\n\nEMOJI POLICY: Use tasteful emojis naturally inside the post body where they enhance meaning (1-4 per post). Do NOT spam emojis.`
          : `\n\nEMOJI POLICY (STRICT): DO NOT use ANY emojis, emoticons, or pictographs in ANY field (post body, hashtags, tags, alt_text). Plain text only. Zero emojis. If you would normally add an emoji, omit it entirely.`)
      : "";
    // Tone is placed FIRST and as the highest-priority directive so it overrides any
    // tone-suggestive words in the schema field labels (like "professional").
    const systemPrompt = `${toneInstruction(tone)}

${baseSystemPrompt}${contextInstruction}${emojiInstruction}

FINAL REMINDER: The TONE at the top of this prompt is your #1 directive. Apply it identically to option_1, option_2, and option_3 — they differ ONLY in structure (standard / narrative / concise), never in voice. Do NOT change the JSON keys or schema.`;

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
              role: "system",
              content: tone === "Gen Z"
                ? "You are a chronically-online Gen Z creator (born 1997-2012). You write everything in Gen Z slang, lowercase, with internet humor. You NEVER write corporate, polished, or millennial-sounding copy. Even when asked to be 'professional', you stay Gen Z — just slightly more structured."
                : `You are a creative copywriter who strictly follows tone instructions. The user's chosen tone takes priority over field labels.`,
            },
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                { type: "image_url", image_url: { url: imageData } },
              ],
            },
          ],
          temperature: tone === "Gen Z" ? 1.0 : 0.85,
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
      else {
        let li = parsed as LinkedInResult;
        if (!useEmojis) {
          li = {
            option_1: stripEmojis(li.option_1 || ""),
            option_2: stripEmojis(li.option_2 || ""),
            option_3: stripEmojis(li.option_3 || ""),
            hashtags: li.hashtags || "",
            tags: li.tags || "",
            alt_text: li.alt_text || "",
          };
        }
        setLiResult(li);
      }
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
                onClick={() => {
                  setTone(t.value);
                  // Clear stale results so previews always reflect the chosen tone
                  setIgResult(null);
                  setLiResult(null);
                }}
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

      {/* Emoji Toggle (LinkedIn only) */}
      {!isInstagram && (
        <div
          className="animate-fade-in-up flex items-center justify-center gap-3 glass rounded-xl px-4 py-3 max-w-md mx-auto"
          style={{ animationDelay: "145ms" }}
        >
          <Smile className={`w-4 h-4 ${useEmojis ? "text-blue-500" : "text-muted-foreground"}`} />
          <Label htmlFor="li-emoji-toggle" className="text-sm font-semibold cursor-pointer flex-1">
            Use emojis in posts
            <span className="block text-[11px] font-normal text-muted-foreground">
              {useEmojis ? "Posts will include tasteful emojis" : "Plain text — no emojis at all"}
            </span>
          </Label>
          <Switch
            id="li-emoji-toggle"
            checked={useEmojis}
            onCheckedChange={setUseEmojis}
          />
        </div>
      )}

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
      {isInstagram && igResult && imageData && !loading && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${accentBg}`}>
              <Eye className="w-3 h-3" /> Live Instagram Previews
            </div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              Three {tone} captions, exactly how they'll look on Instagram
            </h3>
            <p className="text-sm text-muted-foreground">All in your selected {tone} tone — compare and copy your favorite</p>
          </div>

          {/* Three previews — side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-4 items-start">
            {([
              { key: "option_1", label: "Option 1", emoji: "①" },
              { key: "option_2", label: "Option 2", emoji: "②" },
              { key: "option_3", label: "Option 3", emoji: "③" },
            ] as const).map((v, i) => (
              <div key={v.key} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg">{v.emoji}</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent uppercase tracking-wider">
                    {v.label}
                  </span>
                </div>
                <InstagramPreview
                  imageUrl={imageData}
                  caption={igResult[v.key]}
                  hashtags={igResult.hashtags}
                  variant={v.key}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-2">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              ✨ Instagram Toolkit
            </h4>
            <p className="text-center text-[11px] text-muted-foreground">Tap any card to copy</p>
          </div>
          <div className="space-y-3">
            <CaptionCard label="Hashtags" emoji="#️⃣" content={igResult.hashtags} accent="pink" multiline delay={0} />
            <CaptionCard label="Whom To Tag" emoji="🏷️" content={igResult.tags} accent="purple" delay={80} />
            <CaptionCard label="Image Alt Text" emoji="♿" content={igResult.alt_text} accent="emerald" delay={160} />
          </div>
        </div>
      )}

      {/* LinkedIn Results */}
      {!isInstagram && liResult && imageData && !loading && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${accentBg}`}>
              <Eye className="w-3 h-3" /> Live LinkedIn Previews
            </div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              Three {tone} posts, exactly how they'll look on LinkedIn
            </h3>
            <p className="text-sm text-muted-foreground">All in your selected {tone} tone — compare and copy your favorite</p>
          </div>

          {/* Three previews — side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-4 items-start">
            {([
              { key: "option_1", label: "Option 1", emoji: "①" },
              { key: "option_2", label: "Option 2", emoji: "②" },
              { key: "option_3", label: "Option 3", emoji: "③" },
            ] as const).map((v, i) => (
              <div key={v.key} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg">{v.emoji}</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent uppercase tracking-wider">
                    {v.label}
                  </span>
                </div>
                <LinkedInPreview
                  imageUrl={imageData}
                  post={liResult[v.key]}
                  hashtags={liResult.hashtags}
                  variant={v.label}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-2">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              📣 LinkedIn Toolkit
            </h4>
            <p className="text-center text-[11px] text-muted-foreground">Tap any card to copy</p>
          </div>
          <div className="space-y-3">
            <CaptionCard label="Hashtags" emoji="#️⃣" content={liResult.hashtags} accent="blue" multiline delay={0} />
            <CaptionCard label="Whom To Tag" emoji="🏷️" content={liResult.tags} accent="purple" delay={80} />
            <CaptionCard label="Image Alt Text" emoji="♿" content={liResult.alt_text} accent="emerald" delay={160} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptionGenerator;
