"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  highlight?: boolean;
  hint?: string;
};

export default function MLMStatCard({
  title,
  value,
  icon,
  trend,
  trendLabel = "growth",
  highlight,
  hint,
}: Props) {
  const isPositive = trend !== undefined && trend > 0;

  return (
    <motion.div
      whileHover={{ rotateX: 6, rotateY: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`
        relative group
        rounded-3xl p-4 md:p-7
        overflow-hidden

        bg-gradient-to-br from-[#0A0F1F] to-[#05070F]
        border border-white/10

        shadow-[0_20px_60px_rgba(0,0,0,0.7)]

        ${highlight ? "ring-1 ring-indigo-500/40" : ""}
      `}
    >
      {/* 🔮 Floating Energy Orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full group-hover:scale-125 transition duration-700" />

      {/* 🌐 Network Grid Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />

      {/* ✨ Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-400/30 transition" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs tracking-widest text-indigo-300/70 uppercase">
            {title}
          </p>

          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 break-words">
            {value}
          </h2>
          {hint ? (
            <p className="text-xs text-slate-400 mt-2 max-w-[16rem] leading-snug">{hint}</p>
          ) : null}
        </div>

        {icon && (
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md text-indigo-300 group-hover:scale-110 transition">
            {icon}
          </div>
        )}
      </div>

      {/* 📈 Trend Section */}
      {trend !== undefined && (
        <div className="flex items-center gap-3 mt-6 relative z-10">
          <div
            className={`
              flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
              ${
                isPositive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }
            `}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>

          <span className="text-xs text-slate-400">{trendLabel}</span>
        </div>
      )}

      {/* ⚡ Earnings Pulse Line */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40"
      />

      {/* 🔥 Bottom Gradient Fill */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </motion.div>
  );
}