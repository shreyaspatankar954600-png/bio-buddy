import { useState, useEffect } from "react";
import { Loader2, Sparkles, Wand2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformPreview from "@/components/PlatformPreview";
import ShareButtons from "@/components/ShareButtons";
import FloatingParticles from "@/components/FloatingParticles";

type Platform = "instagram" | "linkedin";
type Tone = "Professional" | "Casual" | "Funny" | "Inspirational" | "Gen Z";

const toneEmojis: Record<Tone, string> = {
  Professional: "💼",
  Casual: "😎",
  Funny: "😂",
  Inspirational: "✨",
  "Gen Z": "💅",
};

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [platform, setPlatform] = useState<Platform>("instagram");

  const [bios, setBios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const charLimit = platform === "instagram" ? 150 : 220;

  useEffect(() => {
    const stored = localStorage.getItem("groq_api_key");
    setHasApiKey(!!stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleApiKeySave = (key: string) => {
    setHasApiKey(!!key);
  };

  const parseBios = (text: string): string[] => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const results: string[] = [];
    for (const line of lines) {
      const cleaned = line.replace(/^\d+[\.\)\-\:]\s*/, "").replace(/^\*\*.*?\*\*\s*/, "").trim();
      if (cleaned.length > 5) results.push(cleaned);
    }
    return results.slice(0, 3);
  };

  const generate = async () => {
    const apiKey = localStorage.getItem("groq_api_key");
    if (!apiKey) {
      setError("Please add your Groq API key first (click the API Key button).");
      return;
    }
    if (!name.trim() || !profession.trim()) {
      setError("Please fill in your name and profession.");
      return;
    }

    setLoading(true);
    setError("");
    setBios([]);

    const toneInstruction = tone === "Gen Z"
      ? "Tone: Gen Z — use Gen Z slang, internet lingo, and trendy words like 'slay', 'no cap', 'lowkey', 'vibe check', 'it's giving', 'bestie', 'main character energy', 'ate and left no crumbs', 'understood the assignment', 'periodt', 'based', 'living rent free'. Make it sound like a trendy Gen Z person wrote it."
      : `Tone: ${tone}.`;

    const prompt = `Generate exactly 3 bio variations for ${platform} for a person named ${name} who is a ${profession}. Keywords: ${keywords || "none"}. ${toneInstruction} Format: return only the 3 bios, numbered 1, 2, 3. For Instagram keep each under 150 characters. For LinkedIn keep each under 220 characters.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("No response from the API.");

      const parsed = parseBios(text);
      if (parsed.length === 0) throw new Error("Could not parse bios from the response.");
      setBios(parsed);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className={`fixed inset-0 transition-all duration-1000 ${
          platform === "instagram" ? "gradient-instagram" : "gradient-linkedin"
        }`}
        style={{ backgroundSize: "200% 200%", animation: "gradient-shift 6s ease infinite" }}
      />
      <div className="fixed inset-0 bg-background/85 backdrop-blur-sm" />

      <FloatingParticles platform={platform} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          hasApiKey={hasApiKey}
          onApiKeySave={handleApiKeySave}
        />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8">
          {/* Hero */}
          <div className="animate-fade-in-up text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3" /> Powered by AI
            </div>
            <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${
              platform === "instagram" ? "gradient-text-ig" : "gradient-text-li"
            }`}>
              AI Bio Generator
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Create the perfect bio for <span className="font-semibold text-foreground">Instagram</span> or{" "}
              <span className="font-semibold text-foreground">LinkedIn</span> in seconds with AI.
            </p>
          </div>

          {/* Platform Toggle */}
          <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex rounded-2xl glass p-1.5 gap-1">
              {(["instagram", "linkedin"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize ${
                    platform === p
                      ? p === "instagram"
                        ? "gradient-instagram text-primary-foreground shadow-lg scale-105"
                        : "gradient-linkedin text-primary-foreground shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {p === "instagram" ? "📸 Instagram" : "💼 LinkedIn"}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className="animate-fade-in-up glass-strong rounded-2xl p-5 sm:p-7 space-y-5"
            style={{ animationDelay: "200ms" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1">
                  👤 Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01] focus:shadow-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profession" className="text-sm font-semibold flex items-center gap-1">
                  💼 Profession / Role
                </Label>
                <Input
                  id="profession"
                  placeholder="Profession / Role"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01] focus:shadow-md"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="keywords" className="text-sm font-semibold flex items-center gap-1">
                🏷️ Keywords
              </Label>
              <Input
                id="keywords"
                placeholder="photographer, travel lover, Mumbai"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.01] focus:shadow-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tone" className="text-sm font-semibold flex items-center gap-1">
                🎭 Tone
              </Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger className="transition-all duration-300 focus:scale-[1.01]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Professional", "Casual", "Funny", "Inspirational", "Gen Z"] as Tone[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {toneEmojis[t]} {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="animate-fade-in-up text-sm text-destructive font-medium bg-destructive/10 px-4 py-2.5 rounded-xl border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              onClick={generate}
              disabled={loading}
              variant={platform === "instagram" ? "generate" : "generate-linkedin"}
              size="lg"
              className="w-full text-base font-bold py-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="ml-2">Crafting your bios...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span className="ml-2">Generate Bio</span>
                  <Sparkles className="w-4 h-4 ml-1 animate-bounce-subtle" />
                </>
              )}
            </Button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-border/50 overflow-hidden">
                    <div className="shimmer h-[340px]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {bios.length > 0 && !loading && (
            <div className="space-y-8">
              <div className="animate-fade-in-up text-center space-y-2">
                <h3 className={`text-2xl font-bold ${
                  platform === "instagram" ? "gradient-text-ig" : "gradient-text-li"
                }`}>
                  Your Bios Are Ready! 🎉
                </h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  See how they look on {platform === "instagram" ? "Instagram" : "LinkedIn"}
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce-subtle" />
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bios.map((bio, i) => (
                  <div
                    key={i}
                    className="animate-fade-in-up space-y-2"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <span className={`block text-center text-xs font-bold uppercase tracking-wider ${
                      platform === "instagram" ? "text-accent" : "text-primary"
                    }`}>
                      Option {i + 1}
                    </span>
                    <PlatformPreview
                      bio={bio}
                      name={name}
                      profession={profession}
                      platform={platform}
                      delay={i * 150}
                    />
                  </div>
                ))}
              </div>
              <ShareButtons />
            </div>
          )}

          {/* Ad Placeholder */}
          <div className="animate-fade-in rounded-2xl border-2 border-dashed border-border/50 bg-muted/30 p-8 text-center backdrop-blur-sm">
            <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">Advertisement</p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
