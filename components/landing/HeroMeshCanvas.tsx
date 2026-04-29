"use client";

import { useEffect, useRef } from "react";

const NODE_COUNT = 52;
/** Normalized distance (0–1 plane) under which nodes link */
const LINK_DIST_N = 0.13;
const WRAP = 1;

type Particle = { x: number; y: number; vx: number; vy: number };

/**
 * Drifting connected nodes — low-opacity mesh behind the hero grid.
 * Off when `reduceMotion` (caller should not mount, but we guard in effect).
 */
export default function HeroMeshCanvas({ reduceMotion }: { reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const seed = (w: number, h: number) => {
      const scale = Math.min(w, h);
      const speed = 0.00042 * (400 / scale);
      particlesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }));
    };

    const draw = (w: number, h: number) => {
      const parts = particlesRef.current;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += WRAP;
        if (p.x > WRAP) p.x -= WRAP;
        if (p.y < 0) p.y += WRAP;
        if (p.y > WRAP) p.y -= WRAP;
      }

      ctx.clearRect(0, 0, w, h);
      const linkN2 = LINK_DIST_N * LINK_DIST_N;

      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i];
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const n2 = dx * dx + dy * dy;
          if (n2 < linkN2 && n2 > 0) {
            const d = Math.sqrt(n2);
            const t = (1 - d / LINK_DIST_N) * 0.2;
            ctx.strokeStyle = `rgba(147,197,253,${t})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      for (const p of parts) {
        ctx.fillStyle = "rgba(167,139,250,0.55)";
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0) {
        draw(w, h);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
