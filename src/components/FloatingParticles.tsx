import { useMemo } from "react";

interface FloatingParticlesProps {
  platform: "instagram" | "linkedin";
}

const FloatingParticles = ({ platform }: FloatingParticlesProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 12,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-10px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: platform === "instagram"
              ? `hsl(${270 + Math.random() * 60} 60% 55%)`
              : `hsl(${190 + Math.random() * 30} 70% 50%)`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
