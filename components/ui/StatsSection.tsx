"use client";

import StatCard from "@/components/ui/StatCard";
import React from "react";

type StatItem = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  highlight?: boolean;
};

type Props = {
  title: string;
  stats: StatItem[];
  columns?: 1 | 2 | 3 | 4;
};

export default function StatsSection({
  title,
  stats,
  columns = 4,
}: Props) {

  const gridCols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return (
    <section className="relative space-y-6">

      {/* 🔥 Section Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 w-[300px] h-[200px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-0 bottom-0 w-[300px] h-[200px] bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            {title}
          </h2>

          <p className="text-xs text-slate-400">
            Real-time MLM performance overview
          </p>
        </div>

        {/* Optional Right Action (future use) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Data
        </div>

      </div>

      {/* Divider Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Grid */}
      <div
        className={`
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          ${gridCols[columns]}
        `}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <StatCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              trend={item.trend}
              trendLabel={item.trendLabel}
              highlight={item.highlight}
            />
          </div>
        ))}
      </div>

    </section>
  );
}