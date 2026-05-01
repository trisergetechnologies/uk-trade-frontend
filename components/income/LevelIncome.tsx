"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getIncomeTrade, type TradeCreditRow } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function LevelIncome() {
  const router = useRouter();
  const [levelFilter, setLevelFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TradeCreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getIncomeTrade();
        if (cancelled) return;
        setRows(res.data || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load trade income.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startWeek = startToday - 6 * 24 * 60 * 60 * 1000;
    return rows.filter((row) => {
      const createdTs = row.createdAt ? new Date(row.createdAt).getTime() : 0;
      if (levelFilter === "Today" && createdTs < startToday) return false;
      if (levelFilter === "This Week" && createdTs < startWeek) return false;
      const hay = JSON.stringify(row).toLowerCase();
      if (q && !hay.includes(q)) return false;
      return true;
    });
  }, [rows, levelFilter, search]);

  const total = filtered.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-3 md:p-6">

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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Trade Income History
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Daily trade credits from your active packages
          </p>
          {error && <p className="text-amber-400 text-sm mt-2">{error}</p>}
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          <p className="text-sm text-slate-300">Total Trade Income ({levelFilter})</p>
          <h1 className="text-3xl font-bold mt-1">{loading ? "…" : formatInr(total)}</h1>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* DATE FILTER */}
          {["All", "Today", "This Week"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                levelFilter === lvl
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {lvl}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search trade entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto sm:ml-auto px-3 py-1.5 rounded-lg bg-[#050816] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full min-w-[640px] text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="px-4 text-left">Amount</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, idx) => (
                <motion.tr
                  key={`${item.createdAt || item.creditDateIst || "row"}-${idx}`}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  {/* LEVEL BADGE */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      Trade
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 font-semibold text-green-400">
                    {formatInr(Number(item.amount) || 0)}
                  </td>

                  {/* DATE */}
                  <td className="px-4 text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.creditDateIst || "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No records found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}