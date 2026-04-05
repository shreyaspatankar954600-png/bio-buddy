import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

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
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="API Settings">
          <Settings className="w-5 h-5 text-muted-foreground" />
          {hasKey && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Groq API Key</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Paste your Groq API key below. It's stored locally in your browser and never sent to any server except Groq's API.
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
