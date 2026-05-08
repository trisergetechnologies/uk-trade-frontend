"use client";

import { useEffect, useState } from "react";
import { Users, BadgeIndianRupee } from "lucide-react";
import { getMyTeamSummary, type TeamSummaryDto } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const CARD_BASE =
  "rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-4 md:p-5 flex items-start gap-3";

type CardProps = {
  title: string;
  value: string;
  side: "left" | "right";
  icon: React.ReactNode;
};

function StatBlock({ title, value, side, icon }: CardProps) {
  const accent =
    side === "left"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
      : "text-indigo-300 bg-indigo-500/10 border-indigo-500/20";
  return (
    <div className={CARD_BASE}>
      <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
        <p className="text-lg md:text-xl font-semibold text-white mt-1 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function CommunitySplit() {
  const [data, setData] = useState<TeamSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyTeamSummary();
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load community");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base md:text-lg font-semibold text-white">Community split</h3>
        <p className="text-xs text-slate-500">Your downline by binary branch</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBlock
          title="Left community users"
          value={String(data.myLeftMembers)}
          side="left"
          icon={<Users size={18} />}
        />
        <StatBlock
          title="Right community users"
          value={String(data.myRightMembers)}
          side="right"
          icon={<Users size={18} />}
        />
        <StatBlock
          title="Left investment"
          value={formatInr(data.myLeftInvestment || 0)}
          side="left"
          icon={<BadgeIndianRupee size={18} />}
        />
        <StatBlock
          title="Right investment"
          value={formatInr(data.myRightInvestment || 0)}
          side="right"
          icon={<BadgeIndianRupee size={18} />}
        />
      </div>
    </section>
  );
}
