import { useRef, useState } from "react";
import { Loader2, Upload, Sparkles, Wand2, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CaptionCard from "./CaptionCard";

interface CaptionResult {
  witty: string;
  professional: string;
  casual: string;
  linkedin_post: string;
  tags: string;
  alt_text: string;
}

const PhotoCaptionGenerator = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CaptionResult | null>(null);
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
    setResult(null);
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
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setResult(null);

    const systemPrompt = `You are an expert social media copywriter and personal-branding assistant. Analyze the provided image carefully (note: people, objects, setting, mood, achievements, certificates, brands, locations). Respond ONLY with valid JSON, no markdown, no commentary. Use this exact schema:
{
  "witty": "a clever, humorous caption with light wordplay (1-2 sentences, with 2-3 emojis)",
  "professional": "a polished, brand-safe caption suitable for portfolios (1-2 sentences)",
  "casual": "a relaxed, friendly caption like a real person posting to friends (1-2 sentences with emojis)",
  "linkedin_post": "a full LinkedIn post (4-7 short paragraphs, hook + story + lesson + CTA, with line breaks as \\n\\n, professional tone, includes 3-5 relevant hashtags at the end)",
  "tags": "comma-separated suggestions of who/what to tag (people roles, organizations, brands, locations visible) — start each with @ if it looks like a handle, or describe (e.g. '@yourcompany, your manager, the event organizer, @microsoft')",
  "alt_text": "a concise, descriptive alt text for accessibility describing exactly what is in the image (1-2 sentences, no emojis)"
}`;

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
          temperature: 0.8,
          max_tokens: 1200,
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

      let parsed: CaptionResult;
      try {
        parsed = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Could not parse AI response.");
        parsed = JSON.parse(match[0]);
      }

      setResult(parsed);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="animate-fade-in-up text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3 h-3" /> AI Vision Powered
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
          AI Photo Caption Generator
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Upload any photo or certificate. Get <span className="font-semibold text-foreground">3 captions</span>, a{" "}
          <span className="font-semibold text-foreground">LinkedIn post</span>, tag suggestions and alt text — instantly.
        </p>
      </div>

      {/* Upload */}
      <div className="animate-fade-in-up glass-strong rounded-2xl p-5 sm:p-7 space-y-5" style={{ animationDelay: "150ms" }}>
        {!imageData ? (
          <label
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-8 sm:p-12 cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
          className="w-full text-base font-bold py-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="ml-2">Reading your image...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span className="ml-2">Generate Captions</span>
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

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="animate-fade-in-up text-center space-y-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Your Captions Are Ready! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">Tap any card to copy</p>
          </div>

          <div className="space-y-3">
            <CaptionCard label="Witty" emoji="😏" content={result.witty} accent="pink" delay={0} />
            <CaptionCard label="Professional" emoji="💼" content={result.professional} accent="blue" delay={80} />
            <CaptionCard label="Casual" emoji="😎" content={result.casual} accent="amber" delay={160} />
          </div>

          <div className="space-y-1 pt-2">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              📣 LinkedIn Toolkit
            </h4>
          </div>
          <div className="space-y-3">
            <CaptionCard
              label="LinkedIn Post"
              emoji="💼"
              content={result.linkedin_post}
              accent="blue"
              multiline
              delay={240}
            />
            <CaptionCard label="Whom To Tag" emoji="🏷️" content={result.tags} accent="purple" delay={320} />
            <CaptionCard label="Image Alt Text" emoji="♿" content={result.alt_text} accent="emerald" delay={400} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptionGenerator;
