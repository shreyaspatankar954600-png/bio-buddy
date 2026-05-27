import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 60;
const framePath = (i: number) =>
  `/frames/frame${String(i).padStart(3, "0")}.jpg`;

interface ScrollCanvasProps {
  children?: React.ReactNode;
}

const ScrollCanvas = ({ children }: ScrollCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  // Preload frames
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === FRAME_COUNT) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // grey placeholder
      ctx.fillStyle = "#1a1a24";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    // cover fit
    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw = cw,
      dh = ch,
      dx = 0,
      dy = 0;
    if (ir > cr) {
      dh = ch;
      dw = dh * ir;
      dx = (cw - dw) / 2;
    } else {
      dw = cw;
      dh = dw / ir;
      dy = (ch - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT),
      );
      drawFrame(frame);
      // Overlay fades out by 30% of hero scroll
      const fade = Math.max(0, 1 - progress / 0.3);
      setOverlayOpacity(fade);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  const progressPct = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-background"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
            <div className="w-64 space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Loading experience… {progressPct}%
              </p>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}
        <div
          className="absolute inset-0 flex items-end justify-center pb-[20vh] px-4 z-10 pointer-events-none"
          style={{ opacity: overlayOpacity, transition: "opacity 0.15s linear" }}
        >
          <div className="pointer-events-auto max-w-3xl text-center space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollCanvas;
