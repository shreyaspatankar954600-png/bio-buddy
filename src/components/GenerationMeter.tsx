import { useAuth } from "@/contexts/AuthContext";

interface Props {
  kind: "bio" | "caption";
}

const GenerationMeter = ({ kind }: Props) => {
  const { user, canGenerate } = useAuth();
  const { used, total } = canGenerate(kind);
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const label = user
    ? `${used} of ${total} generations used this month`
    : `${used} of ${total} free ${kind} generations used`;

  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-[11px] text-muted-foreground text-center">{label}</p>
      <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default GenerationMeter;
