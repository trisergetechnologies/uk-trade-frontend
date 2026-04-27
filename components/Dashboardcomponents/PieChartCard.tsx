"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MoreHorizontal } from "lucide-react";
import { getIncomeMatching, getIncomeSponsor, getIncomeTrade } from "@/lib/api";
import { totalIncomeAllTime } from "@/lib/incomeAggregates";
import { formatInr } from "@/lib/formatInr";

/* ---------- TYPES ---------- */
type ChartData = {
  name: string;
  value: number;
};

/* ---------- COLORS ---------- */
const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b"];

/* ---------- TOOLTIP ---------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const p = payload[0] as { name?: string; value?: number };
    return (
      <div className="bg-[#0B0F19]/90 p-3 rounded-xl border border-white/10 backdrop-blur-xl">
        <p className="text-xs text-slate-400">{p.name}</p>
        <p className="text-sm font-bold text-white">
          {formatInr(Number(p.value) || 0)}
        </p>
      </div>
    );
  }
  return null;
}

/* ---------- COMPONENT ---------- */
export default function PieChartCard({ title = "Income mix" }: { title?: string }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tradeRes, sponsorRes, matchRes] = await Promise.all([
          getIncomeTrade(),
          getIncomeSponsor(),
          getIncomeMatching(),
        ]);
        if (cancelled) return;
        const { trade, sponsor, matching, total: sum } = totalIncomeAllTime(
          tradeRes.data || [],
          sponsorRes.data || [],
          matchRes.data || []
        );
        if (sum <= 0) {
          setData([]);
          return;
        }
        const raw: ChartData[] = [
          { name: "Trade income", value: trade },
          { name: "Sponsor income", value: sponsor },
          { name: "Matching income", value: matching },
        ];
        setData(raw.filter((d) => d.value > 0));
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load chart");
          setData([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      className="
      relative group
      bg-[#0B0F19]/80
      border border-white/10
      backdrop-blur-xl
      rounded-3xl p-6
      overflow-hidden
      transition-all duration-500
      hover:-translate-y-1
      hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]
    "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </h2>

        <button type="button" className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {error && (
        <p className="text-xs text-amber-400/90 mb-2 relative z-10">{error}</p>
      )}

      <div className="h-64 relative z-10">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm px-4 text-center">
            No income recorded yet. Top stats update when trade, sponsor, or matching credits appear.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={data}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {data.length > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-slate-400">Total</p>
          <h3 className="text-xl font-bold text-white">
            {formatInr(total)}
          </h3>
        </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-6 space-y-3 relative z-10">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-slate-400">{item.name}</span>
              </div>

              <span className="text-white font-semibold">
                {formatInr(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 group-hover:w-full transition-all duration-500" />
    </div>
  );
}
