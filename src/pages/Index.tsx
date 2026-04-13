import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioCard from "@/components/BioCard";
import PlatformPreview from "@/components/PlatformPreview";
import ShareButtons from "@/components/ShareButtons";

type Platform = "instagram" | "linkedin";
type Tone = "Professional" | "Casual" | "Funny" | "Inspirational";

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
      setError("Please add your Groq API key first (click the ⚙️ icon).");
      return;
    }
    if (!name.trim() || !profession.trim()) {
      setError("Please fill in your name and profession.");
      return;
    }

    setLoading(true);
    setError("");
    setBios([]);

    const prompt = `Generate exactly 3 bio variations for ${platform} for a person named ${name} who is a ${profession}. Keywords: ${keywords || "none"}. Tone: ${tone}. Format: return only the 3 bios, numbered 1, 2, 3. For Instagram keep each under 150 characters. For LinkedIn keep each under 220 characters.`;

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
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${platform === "instagram" ? "gradient-instagram" : "gradient-linkedin"}`}>
      <div className="min-h-screen flex flex-col bg-background/80 backdrop-blur-sm">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          hasApiKey={hasApiKey}
          onApiKeySave={handleApiKeySave}
        />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8">
          {/* Hero */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              AI Bio Generator
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Create the perfect bio for Instagram or LinkedIn in seconds with AI.
            </p>
          </div>

          {/* Platform Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl bg-secondary p-1 gap-1">
              {(["instagram", "linkedin"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                    platform === p
                      ? p === "instagram"
                        ? "gradient-instagram text-primary-foreground shadow-md"
                        : "gradient-linkedin text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-bio-card border border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                <Input id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profession" className="text-sm font-medium">Profession / Role</Label>
                <Input id="profession" placeholder="Profession / Role" value={profession} onChange={(e) => setProfession(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="keywords" className="text-sm font-medium">Keywords</Label>
              <Input id="keywords" placeholder="photographer, travel lover, Mumbai" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Professional", "Casual", "Funny", "Inspirational"] as Tone[]).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <Button
              onClick={generate}
              disabled={loading}
              variant={platform === "instagram" ? "generate" : "generate-linkedin"}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Bio</>
              )}
            </Button>
          </div>

          {/* Results */}
          {bios.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-foreground text-center">
                Preview how your bio looks on {platform === "instagram" ? "Instagram" : "LinkedIn"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bios.map((bio, i) => (
                  <div key={i} className="space-y-2">
                    <span className={`block text-center text-xs font-semibold uppercase tracking-wider ${platform === "instagram" ? "text-accent" : "text-primary"}`}>
                      Option {i + 1}
                    </span>
                    <PlatformPreview bio={bio} name={name} profession={profession} platform={platform} />
                  </div>
                ))}
              </div>
              <ShareButtons />
            </div>
          )}

          {/* Ad Placeholder */}
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/50 p-6 text-center">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Advertisement</p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
