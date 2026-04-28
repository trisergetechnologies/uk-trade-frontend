"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getIncomeMatching, type MatchingIncomeRow } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

function rowAmount(row: MatchingIncomeRow): number {
  return Number(row.payoutCreditedAmount ?? row.creditedAmount ?? row.amount ?? 0) || 0;
}

export default function MatchingIncome() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [rows, setRows] = useState<MatchingIncomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getIncomeMatching();
        if (cancelled) return;
        setRows(res.data || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load matching income.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleRows = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startWeek = startToday - 6 * 24 * 60 * 60 * 1000;
    if (filter === "Today") {
      return rows.filter((r) => {
        const t = r.createdAt ? new Date(r.createdAt).getTime() : 0;
        return t >= startToday;
      });
    }
    if (filter === "This Week") {
      return rows.filter((r) => {
        const t = r.createdAt ? new Date(r.createdAt).getTime() : 0;
        return t >= startWeek;
      });
    }
    return rows;
  }, [filter, rows]);

  const total = visibleRows.reduce((sum, item) => sum + rowAmount(item), 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Matching Income
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Earnings from binary pairing (Left vs Right)
          </p>
          {error && <p className="text-amber-400 text-sm mt-2">{error}</p>}
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <p className="text-sm text-slate-300">Total Matching Income ({filter})</p>
          <h1 className="text-3xl font-bold mt-1">{loading ? "…" : formatInr(total)}</h1>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {["All", "Today", "This Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-500"
                  : "text-slate-400 border-white/10 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="px-4 text-left">Pair (L:R)</th>
                <th className="px-4 text-left">Amount</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((item, idx) => (
                <motion.tr
                  key={`${item.createdAt || item.creditDateIst || "row"}-${idx}`}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  {/* USER */}
                  <td className="px-4 py-3 font-medium text-white">
                    {item.status || "credited"}
                  </td>

                  {/* PAIR */}
                  <td className="px-4 text-xs text-slate-300">
                    <span className="text-slate-400">—</span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 font-semibold text-green-400">
                    {formatInr(rowAmount(item))}
                  </td>

                  {/* DATE */}
                  <td className="px-4 text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {!loading && visibleRows.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No matching income found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}