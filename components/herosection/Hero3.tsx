"use client";

import { useState, useEffect, useRef } from "react";
import { Users, TrendingUp, Award, Sparkles } from "lucide-react";

/* ------------------ BIGGER TREE DATA ------------------ */
const NODES = [
  { id: "root", name: "Krishna", cx: 500, cy: 100, parentId: null },

  { id: "left", name: "Sun", cx: 260, cy: 260, parentId: "root" },
  { id: "right", name: "Moon", cx: 740, cy: 260, parentId: "root" },

  { id: "leftLeft", name: "Jupiter", cx: 120, cy: 460, parentId: "left" },
  { id: "leftRight", name: "Saturn", cx: 380, cy: 460, parentId: "left" },

  { id: "rightLeft", name: "Mercury", cx: 620, cy: 460, parentId: "right" },
  { id: "rightRight", name: "Venus", cx: 880, cy: 460, parentId: "right" },
];

/* ------------------ BIG PREMIUM SIZES ------------------ */
const NODE_STYLES: Record<string, { r: number; fill: string }> = {
  root: { r: 70, fill: "#a855f7" },
  left: { r: 52, fill: "#6366f1" },
  right: { r: 52, fill: "#ec4899" },

  leftLeft: { r: 42, fill: "#6366f1" },
  leftRight: { r: 42, fill: "#6366f1" },
  rightLeft: { r: 42, fill: "#ec4899" },
  rightRight: { r: 42, fill: "#ec4899" },
};

/* ------------------ SEQUENCE ------------------ */
const SEQUENCE = [
  { id: "root", delay: 0 },
  { id: "left", delay: 400 },
  { id: "right", delay: 800 },
  { id: "leftLeft", delay: 1200 },
  { id: "leftRight", delay: 1500 },
  { id: "rightLeft", delay: 1800 },
  { id: "rightRight", delay: 2100 },
];

export default function BinaryTreeSection() {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [start, setStart] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* -------- SCROLL TRIGGER -------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStart(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* -------- SEQUENCE -------- */
  useEffect(() => {
    if (!start) return;

    const timers: NodeJS.Timeout[] = [];

    SEQUENCE.forEach(({ id, delay }) => {
      const t = setTimeout(() => {
        setVisible((prev) => new Set(prev).add(id));
      }, delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [start]);

  const edges = NODES.filter(
    (n) => n.parentId && visible.has(n.id) && visible.has(n.parentId)
  ).map((n) => ({
    from: NODES.find((x) => x.id === n.parentId)!,
    to: n,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-36"
    >
      {/* GRID BG */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">

        {/* LEFT */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm text-white">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Live Binary Engine
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            <span className="text-white">Real-Time</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Binary Growth
            </span>
          </h1>

          <p className="text-gray-400 max-w-xl">
            Watch your network expand live with smooth animations and premium visuals.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
            <div>
              <div className="flex items-center gap-1 text-xl font-bold text-white">
                <Users className="w-5 h-5 text-purple-400" />
                10K+
              </div>
              <p className="text-xs text-gray-500">Users</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xl font-bold text-white">
                <TrendingUp className="w-5 h-5 text-green-400" />
                ₹2Cr+
              </div>
              <p className="text-xs text-gray-500">Growth</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xl font-bold text-white">
                <Award className="w-5 h-5 text-yellow-400" />
                99.9%
              </div>
              <p className="text-xs text-gray-500">Uptime</p>
            </div>
          </div>
        </div>

        {/* TREE */}
        <div className="relative flex justify-center">
          <svg viewBox="0 0 1000 650" className="w-full">

            <style>
              {`
              @keyframes pop {
                0% { opacity:0; transform: scale(0.4); }
                60% { transform: scale(1.15); }
                100% { opacity:1; transform: scale(1); }
              }

              @keyframes pulse {
                0% { transform: scale(1); opacity:0.3;}
                100% { transform: scale(1.4); opacity:0;}
              }

              @keyframes flow {
                0% { stroke-dashoffset: 120; opacity:0;}
                100% { stroke-dashoffset: 0; opacity:1;}
              }

              .node {
                animation: pop 0.6s ease forwards;
                cursor: pointer;
              }

              .node:hover {
                transform: scale(1.08);
              }

              .glowPulse {
                animation: pulse 1.8s infinite;
              }

              .edge {
                stroke-dasharray: 120;
                stroke-dashoffset: 120;
                animation: flow 1s ease forwards;
              }
            `}
            </style>

            {/* EDGES */}
            <g stroke="rgba(255,255,255,0.25)" strokeWidth="4">
              {edges.map((e, i) => (
                <line
                  key={i}
                  x1={e.from.cx}
                  y1={e.from.cy}
                  x2={e.to.cx}
                  y2={e.to.cy}
                  className="edge"
                />
              ))}
            </g>

            {/* NODES */}
            {NODES.map((node) => {
              if (!visible.has(node.id)) return null;
              const style = NODE_STYLES[node.id];

              return (
                <g key={node.id} className="node">

                  {/* animated glow */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={style.r + 35}
                    fill={style.fill}
                    className="glowPulse"
                  />

                  {/* main */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={style.r}
                    fill={style.fill}
                    stroke="white"
                    strokeOpacity="0.4"
                    strokeWidth="3"
                  />

                  {/* TEXT */}
                  <text
                    x={node.cx}
                    y={node.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={node.id === "root" ? "26" : "18"}
                    fontWeight="bold"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* LIVE STATUS */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-300 bg-black/80 border border-white/10 px-6 py-2 rounded-lg">
            🚀 Live Growth: {visible.size} Active Nodes
          </div>
        </div>
      </div>
    </section>
  );
}