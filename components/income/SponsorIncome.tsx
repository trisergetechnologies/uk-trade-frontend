"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getIncomeSponsor, type SponsorIncomeRow } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function SponsorIncome() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [rows, setRows] = useState<SponsorIncomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getIncomeSponsor();
        if (cancelled) return;
        setRows(res.data || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load sponsor income.");
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
      if (filter === "Today" && createdTs < startToday) return false;
      if (filter === "This Week" && createdTs < startWeek) return false;
      const hay = JSON.stringify(row).toLowerCase();
      if (q && !hay.includes(q)) return false;
      return true;
    });
  }, [rows, filter, search]);

  const total = filtered.reduce((sum, item) => sum + (Number(item.creditedAmount) || 0), 0);

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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Sponsor Income
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Earnings from your direct referrals
          </p>
          {error && <p className="text-amber-400 text-sm mt-2">{error}</p>}
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-600/80 to-emerald-600/80 border border-white/10 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
          <p className="text-sm text-slate-300">Total Sponsor Income</p>
          <h1 className="text-3xl font-bold mt-1">{loading ? "…" : formatInr(total)}</h1>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* FILTER (future use) */}
          {["All", "Today", "This Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-green-600 border-green-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search sponsor events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-[#050816] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="px-4 text-left">Amount</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, idx) => (
                <motion.tr
                  key={`${item.createdAt || "row"}-${idx}`}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  {/* USER */}
                  <td className="px-4 py-3 font-medium text-white">
                    Sponsor event
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 font-semibold text-green-400">
                    {formatInr(Number(item.creditedAmount) || 0)}
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
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No sponsor income found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}