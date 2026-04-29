"use client";

import { motion } from "framer-motion";

const BARS = [96, 142, 120, 186, 156, 204, 168] as const;
const FLOATERS = [
  { x: "4%", y: "14%", size: 4, duration: 8.5, driftX: 14, driftY: -12, delay: 0.2 },
  { x: "92%", y: "21%", size: 3, duration: 10, driftX: -18, driftY: 10, delay: 1.1 },
  { x: "86%", y: "76%", size: 4, duration: 9.2, driftX: -14, driftY: -10, delay: 0.5 },
  { x: "12%", y: "84%", size: 3, duration: 11, driftX: 16, driftY: -8, delay: 1.9 },
  { x: "48%", y: "7%", size: 2.5, duration: 8.8, driftX: -10, driftY: 12, delay: 0.7 },
  { x: "50%", y: "92%", size: 2.5, duration: 10.5, driftX: 10, driftY: -12, delay: 1.4 },
] as const;

export default function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="pointer-events-none absolute -right-10 top-[12%] h-64 w-64 rounded-full bg-purple-600/22 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-[14%] h-72 w-72 rounded-full bg-blue-600/16 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,transparent_70%)]" />

      {!reduceMotion &&
        FLOATERS.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-purple-200/70 shadow-[0_0_14px_rgba(167,139,250,0.35)]"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ x: [0, p.driftX, 0], y: [0, p.driftY, 0], opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            aria-hidden
          />
        ))}

      <div className="relative h-[min(76vh,560px)] w-[min(88%,560px)]">
        <motion.div
          className="absolute inset-0 rounded-full border border-purple-400/20"
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[7%] rounded-full border border-blue-300/15"
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-[14%] rounded-full border border-white/10 bg-[#070912]/75 backdrop-blur-sm" />

        <svg viewBox="0 0 560 560" className="relative h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.95)" />
              <stop offset="60%" stopColor="rgba(139,92,246,0.92)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.72)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.45)" />
              <stop offset="100%" stopColor="rgba(192,132,252,0.55)" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="rgba(124,58,237,0.26)" />
              <stop offset="100%" stopColor="rgba(10,10,20,0)" />
            </radialGradient>
          </defs>

          <circle cx="280" cy="280" r="196" fill="url(#centerGlow)" />

          {[120, 160, 200].map((r) => (
            <circle key={r} cx="280" cy="280" r={r} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
          ))}

          {[148, 196, 244, 292, 340, 388].map((x) => (
            <line key={x} x1={x} y1="164" x2={x} y2="402" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
          ))}
          {[190, 238, 286, 334, 382].map((y) => (
            <line key={y} x1="148" y1={y} x2="412" y2={y} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
          ))}

          {BARS.map((h, i) => {
            const x = 160 + i * 36;
            const w = 24;
            const y = 402 - h;
            return (
              <motion.g key={i}>
                <motion.rect
                  x={x}
                  y={402}
                  width={w}
                  height={0}
                  rx={7}
                  fill="url(#barGrad)"
                  initial={{ y: 402, height: 0 }}
                  animate={reduceMotion ? { y, height: h } : { y: [402, y], height: [0, h] }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                />
                {!reduceMotion && (
                  <motion.rect
                    x={x}
                    y={y + 4}
                    width={w}
                    height={6}
                    rx={3}
                    fill="rgba(255,255,255,0.45)"
                    animate={{ y: [y + 5, y + h - 5, y + 5], opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: 4.2 + i * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.g>
            );
          })}

          <motion.polyline
            points="172,302 208,260 244,282 280,216 316,246 352,198 388,230"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 1] }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />

          {!reduceMotion &&
            [172, 208, 244, 280, 316, 352, 388].map((x, i) => {
              const ys = [302, 260, 282, 216, 246, 198, 230];
              return (
                <motion.circle
                  key={x}
                  cx={x}
                  cy={ys[i]}
                  r="4"
                  fill="rgba(196,181,253,0.95)"
                  animate={{ r: [3.4, 5, 3.4], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                />
              );
            })}

          <motion.circle
            cx="280"
            cy="280"
            r="30"
            fill="rgba(99,102,241,0.2)"
            animate={reduceMotion ? {} : { r: [28, 34, 28], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="280" cy="280" r="10" fill="rgba(196,181,253,0.95)" />
        </svg>
      </div>
    </div>
  );
}
