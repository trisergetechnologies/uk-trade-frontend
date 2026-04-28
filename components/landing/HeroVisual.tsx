"use client";

import { motion } from "framer-motion";

const CX = 200;
const CY = 200;

function pt(radius: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

const RINGS = [
  {
    radius: 162,
    stroke: "rgba(192,132,252,0.28)",
    dash: "14 20",
    strokeWidth: 1.5,
    duration: 46,
    direction: 1,
    nodes: [
      { angleDeg: 0,   color: "#c084fc", glow: "rgba(192,132,252,0.85)", size: 10 },
      { angleDeg: 88,  color: "#93c5fd", glow: "rgba(147,197,253,0.85)", size: 10 },
      { angleDeg: 178, color: "#f0abfc", glow: "rgba(240,171,252,0.8)",  size: 10 },
      { angleDeg: 268, color: "#7dd3fc", glow: "rgba(125,211,252,0.8)",  size: 10 },
    ],
  },
  {
    radius: 114,
    stroke: "rgba(96,165,250,0.28)",
    dash: "8 14",
    strokeWidth: 1.25,
    duration: 29,
    direction: -1,
    nodes: [
      { angleDeg: 30,  color: "#a78bfa", glow: "rgba(167,139,250,0.9)", size: 12 },
      { angleDeg: 150, color: "#38bdf8", glow: "rgba(56,189,248,0.85)", size: 12 },
      { angleDeg: 270, color: "#e879f9", glow: "rgba(232,121,249,0.85)",size: 12 },
    ],
  },
  {
    radius: 70,
    stroke: "rgba(167,139,250,0.35)",
    dash: "5 9",
    strokeWidth: 1,
    duration: 19,
    direction: 1,
    nodes: [
      { angleDeg: 60,  color: "#818cf8", glow: "rgba(129,140,248,0.95)", size: 8 },
      { angleDeg: 240, color: "#c084fc", glow: "rgba(192,132,252,0.95)", size: 8 },
    ],
  },
] as const;

const PULSE_DELAYS = [0, 1.8, 3.6];

// Sweep arc path helper — draws an arc from angle 0° to 55° on a given radius
function sweepArcD(r: number): string {
  const start = pt(r, 0);
  const end   = pt(r, 55);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

export default function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    // h-full / w-full so this fills whatever parent container size is given.
    // On desktop the parent is `absolute inset-y-0 right-0 w-[56%]` — full viewport height.
    // On mobile the parent is an explicit h-[360px] container.
    <div className="relative flex h-full w-full items-center justify-center">

      {/* Ambient glow blobs that bleed behind the rings */}
      <div className="pointer-events-none absolute -right-10 top-[15%] h-64 w-64 rounded-full bg-purple-600/18 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-[15%] h-72 w-72 rounded-full bg-blue-600/14 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_65%)]" />

      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        aria-hidden
      >
        <defs>
          <radialGradient id="hv-coreGrad" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#3b1f7a" />
            <stop offset="100%" stopColor="#07070f" />
          </radialGradient>

          <radialGradient id="hv-coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147,51,234,0.52)" />
            <stop offset="48%" stopColor="rgba(79,70,229,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="hv-nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="hv-coreBloom" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="hv-sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(192,132,252,0)" />
            <stop offset="100%" stopColor="rgba(192,132,252,0.75)" />
          </linearGradient>
        </defs>

        {/* Outermost faint halo boundary */}
        <circle cx={CX} cy={CY} r={186} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* ── Rings + orbiting node groups ── */}
        {RINGS.map((ring, ri) => {
          const rotateTarget = ring.direction === 1 ? 360 : -360;
          return (
            <g key={ri}>
              {/* Static dashed track ring */}
              <circle
                cx={CX} cy={CY} r={ring.radius}
                fill="none"
                stroke={ring.stroke}
                strokeWidth={ring.strokeWidth}
                strokeDasharray={ring.dash}
              />

              {/* All nodes rotate as one group around the SVG center */}
              <motion.g
                style={{ originX: CX, originY: CY }}
                animate={reduceMotion ? {} : { rotate: rotateTarget }}
                transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
              >
                {ring.nodes.map((node, ni) => {
                  const pos = pt(ring.radius, node.angleDeg);
                  return (
                    <g key={ni}>
                      {/* Pulsing halo around node */}
                      <motion.circle
                        cx={pos.x} cy={pos.y}
                        r={node.size + 7}
                        fill="none"
                        stroke={node.glow}
                        strokeWidth="1"
                        animate={reduceMotion ? {} : { opacity: [0.1, 0.45, 0.1] }}
                        transition={{
                          duration: 2.2 + ni * 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: ni * 0.9,
                        }}
                      />
                      {/* Node fill */}
                      <circle
                        cx={pos.x} cy={pos.y}
                        r={node.size}
                        fill={node.color}
                        opacity={0.9}
                        filter="url(#hv-nodeGlow)"
                      />
                      {/* Node border */}
                      <circle
                        cx={pos.x} cy={pos.y}
                        r={node.size}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1"
                      />
                      {/* Specular highlight */}
                      <circle
                        cx={pos.x - node.size * 0.28}
                        cy={pos.y - node.size * 0.28}
                        r={node.size * 0.3}
                        fill="rgba(255,255,255,0.38)"
                      />
                    </g>
                  );
                })}
              </motion.g>
            </g>
          );
        })}

        {/* ── Scanner sweep arc ── */}
        {!reduceMotion && (
          <motion.g
            style={{ originX: CX, originY: CY }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          >
            <path
              d={sweepArcD(162)}
              fill="none"
              stroke="url(#hv-sweepGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={0.6}
            />
          </motion.g>
        )}

        {/* ── Expanding sonar pulse rings ── */}
        {!reduceMotion &&
          PULSE_DELAYS.map((delay, i) => (
            <motion.circle
              key={i}
              cx={CX} cy={CY}
              r={50}
              fill="none"
              stroke="rgba(167,139,250,0.5)"
              strokeWidth="1"
              style={{ originX: CX, originY: CY }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 3.6, opacity: 0 }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeOut",
                delay,
              }}
            />
          ))}

        {/* ── Core glow aura ── */}
        <circle cx={CX} cy={CY} r={82} fill="url(#hv-coreGlow)" />

        {/* ── Core sphere (animated r = breathing effect) ── */}
        <motion.circle
          cx={CX} cy={CY} r={48}
          fill="url(#hv-coreGrad)"
          filter="url(#hv-coreBloom)"
          animate={reduceMotion ? {} : { r: [48, 51, 48] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={CX} cy={CY} r={48}
          fill="none"
          stroke="rgba(192,132,252,0.72)"
          strokeWidth="1.5"
          animate={reduceMotion ? {} : { r: [48, 51, 48] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner counter-spinning dashed ring on core */}
        <motion.circle
          cx={CX} cy={CY} r={40}
          fill="none"
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="1"
          strokeDasharray="4 5"
          style={{ originX: CX, originY: CY }}
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* ── Centre icon: upward trending chart ── */}
        <g transform={`translate(${CX} ${CY})`} opacity="0.93">
          <polyline
            points="-14,13 -6,3 2,-9 10,-3 18,-16"
            fill="none"
            stroke="#e9d5ff"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={18}  cy={-16} r={3.5} fill="#e9d5ff" />
          <circle cx={-14} cy={13}  r={2.2} fill="rgba(233,213,255,0.4)" />
        </g>
      </svg>
    </div>
  );
}
