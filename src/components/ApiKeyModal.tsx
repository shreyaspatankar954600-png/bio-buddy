import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, ExternalLink, CheckCircle2 } from "lucide-react";

interface ApiKeyModalProps {
  hasKey: boolean;
  onSave: (key: string) => void;
}

const ApiKeyModal = ({ hasKey, onSave }: ApiKeyModalProps) => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("groq_api_key");
    if (stored) setKey(stored);
  }, [open]);

  const handleSave = () => {
    localStorage.setItem("groq_api_key", key.trim());
    onSave(key.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative gap-2 font-medium"
          aria-label="API Key Settings"
        >
          <KeyRound className="w-4 h-4" />
          <span className="hidden sm:inline">{hasKey ? "API Key Connected" : "Add API Key"}</span>
          <span className="sm:hidden">{hasKey ? "Connected" : "API Key"}</span>
          {hasKey && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="w-5 h-5 text-primary" />
            Connect Your Groq API Key
          </DialogTitle>
        </DialogHeader>

        {/* Step-by-step guide */}
        <div className="space-y-3 rounded-xl bg-muted/50 border border-border p-4">
          <p className="text-sm font-semibold text-foreground">How to get your free API key:</p>
          <ol className="space-y-2.5 text-sm text-muted-foreground list-none">
            <li className="flex gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
              <span>
                Go to{" "}
                <a
                  href="https://console.groq.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-0.5"
                >
                  console.groq.com
                  <ExternalLink className="w-3 h-3" />
                </a>{" "}
                and sign up for a free account (Google / GitHub login supported).
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
              <span>
                Once logged in, navigate to{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-0.5"
                >
                  API Keys
                  <ExternalLink className="w-3 h-3" />
                </a>{" "}
                in the left sidebar.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
              <span>Click <strong>"Create API Key"</strong>, give it a name (e.g. "BioGen"), and copy the generated key.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">4</span>
              <span>Paste the key below and hit <strong>"Save Key"</strong>. You're all set!</span>
            </li>
          </ol>
        </div>

        {/* Security note */}
        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
          Your key is stored locally in your browser and never sent anywhere except Groq's API.
        </p>

        <Input
          type="password"
          placeholder="gsk_..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="font-mono text-sm"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!key.trim()}>Save Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
