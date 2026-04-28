"use client";

import { motion } from "framer-motion";

/** Background layers — toned down to avoid layout shift / scroll jank. */
export default function HeroBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(120vmin,780px)] w-[min(120vmin,780px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(168,85,247,0.12) 100deg, transparent 200deg, rgba(59,130,246,0.1) 280deg, transparent 360deg)",
        }}
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />

      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.12] ${reduceMotion ? "" : "animate-grid-drift-a"}`}
        style={{
          backgroundImage: `linear-gradient(rgba(167,139,250,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.12) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.07] ${reduceMotion ? "" : "animate-grid-drift-b"}`}
        style={{
          backgroundImage: `linear-gradient(rgba(96,165,250,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#050505_90%)]" />
    </>
  );
}
