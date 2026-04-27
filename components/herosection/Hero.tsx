"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Orbit markers: Framer Motion formats transforms differently in Node vs the browser, which breaks hydration. */
function OrbitNode({
  baseX,
  baseY,
  duration,
}: {
  baseX: number;
  baseY: number;
  duration: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const snapX = Math.round(baseX);
  const snapY = Math.round(baseY);

  if (!mounted) {
    return (
      <div
        className="absolute"
        style={{ transform: `translate(${snapX}px, ${snapY}px)` }}
      >
        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
          ₹
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute"
      initial={{ x: baseX, y: baseY }}
      animate={{
        x: baseX,
        y: [baseY, baseY - 6, baseY],
      }}
      transition={{ repeat: Infinity, duration }}
    >
      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
        ₹
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#050505] text-white pt-40 pb-20">

      {/* 🔥 Gradient Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-600/20 blur-[160px]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-blue-600/20 blur-[160px]" />

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(#ffffff10_1px,transparent_1px),linear-gradient(90deg,#ffffff10_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center mt-10">

        {/* ================= LEFT ================= */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            Build a Scalable
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
              Income Network
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-gray-400 text-lg max-w-lg leading-relaxed"
          >
            Visualize your team growth, track earnings in real-time,
            and scale your MLM business with intelligent automation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <Link
              href="/register"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition shadow-lg shadow-purple-500/20"
            >
              Start Earning
            </Link>

            <Link
              href="/userdashboard"
              className="inline-flex px-6 py-3 rounded-xl border border-white/20 items-center gap-2 hover:bg-white/5 transition"
            >
              View Demo <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-6"
          >
            {[
              { label: "Active Users", value: "25K+" },
              { label: "Revenue", value: "₹2Cr+" },
              { label: "Growth", value: "120%" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
              >
                <p className="text-xl font-semibold">{item.value}</p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex justify-center items-center">

          {/* Glass Container */}
          <div className="relative w-[360px] h-[360px] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center">

            {/* Center Node */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-xl"
            >
              YOU
            </motion.div>

            {/* Network Nodes */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 130;
              const baseX = Math.cos(angle) * radius;
              const baseY = Math.sin(angle) * radius;

              return (
                <div key={i}>
                  {/* Line */}
                  <div
                    className="absolute bg-white/10"
                    style={{
                      width: "2px",
                      height: radius,
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: "top",
                    }}
                  />

                  <OrbitNode baseX={baseX} baseY={baseY} duration={2 + i} />
                </div>
              );
            })}

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl border border-white/10 p-3 rounded-xl"
            >
              <p className="text-xs text-gray-400">Daily</p>
              <p className="text-lg font-semibold">₹3,200</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-xl border border-white/10 p-3 rounded-xl"
            >
              <p className="text-xs text-gray-400">Team</p>
              <p className="text-lg font-semibold">+120</p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}