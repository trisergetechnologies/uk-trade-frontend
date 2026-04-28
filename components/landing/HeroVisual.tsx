"use client";

/**
 * Abstract orbital art — gradient rings, nodes, luminous core (no charts / screenshots).
 */
export default function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto flex h-[min(420px,50vh)] w-full max-w-[540px] items-center justify-center lg:h-[min(480px,54vh)] lg:max-w-none">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.2)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute -right-2 top-6 h-28 w-28 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 -left-4 h-32 w-32 rounded-full bg-blue-500/25 blur-3xl" />

      <div
        className={`relative aspect-square w-[min(100%,380px)] ${reduceMotion ? "" : "hero-visual-spin"}`}
      >
        <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="hvRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <radialGradient id="hvCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
              <stop offset="70%" stopColor="rgba(59,130,246,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="hvSoft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="200" cy="200" r="175" fill="none" stroke="url(#hvRing)" strokeWidth="1.8" strokeDasharray="18 22" opacity="0.75" />
          <circle cx="200" cy="200" r="138" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.3" strokeDasharray="10 16" opacity="0.9" />
          <circle cx="200" cy="200" r="102" fill="none" stroke="rgba(233,213,255,0.35)" strokeWidth="1" strokeDasharray="6 12" />

          {[0, 72, 144, 216, 288].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const r = 158;
            const x = 200 + r * Math.cos(rad);
            const y = 200 + r * Math.sin(rad);
            return <circle key={deg} cx={x} cy={y} r="6" fill="#f5f3ff" opacity="0.85" filter="url(#hvSoft)" />;
          })}

          <circle cx="200" cy="200" r="72" fill="url(#hvCore)" opacity={reduceMotion ? 0.45 : 0.55} />
          <circle cx="200" cy="200" r="48" fill="rgba(15,23,42,0.88)" stroke="url(#hvRing)" strokeWidth="2.5" />
          <circle
            cx="200"
            cy="200"
            r="36"
            fill="none"
            stroke="url(#hvRing)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.65"
          />
        </svg>
      </div>

      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,transparent,rgba(168,85,247,0.07),transparent,rgba(59,130,246,0.08),transparent)] opacity-80 [animation:hero-conic-wash_22s_linear_infinite]" />
      )}
    </div>
  );
}
