"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getMyWithdrawalSummary, getMyWithdrawals, getWalletMe, type WithdrawalStatusFilter } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function PayoutSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | WithdrawalStatusFilter>("all");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getMyWithdrawals>>["data"]>([]);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [eligible, setEligible] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, withdrawalsRes, walletRes] = await Promise.all([
          getMyWithdrawalSummary(),
          getMyWithdrawals(1, 100),
          getWalletMe(),
        ]);
        if (cancelled) return;
        setApprovedTotal(Number(summaryRes.data?.approvedTotal || 0));
        setRows(withdrawalsRes.data || []);
        setEligible(Number(walletRes.data?.eligibleToWithdraw || 0));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load payouts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = rows.filter((item) => {
    const status = (item.status || "").toLowerCase();
    const amount = Number(item.amount || 0);
    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "";
    return (
      (filter === "all" || status === filter) &&
      (String(item.id || "").toLowerCase().includes(search.toLowerCase()) ||
        amount.toString().includes(search) ||
        date.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalPending = useMemo(
    () => rows.filter((i) => i.status === "pending").reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [rows]
  );
  const totalRejected = useMemo(
    () => rows.filter((i) => i.status === "rejected").reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [rows]
  );

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-3 md:p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Payout Summary
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Business view of withdrawal lifecycle and approved payouts
          </p>
          {error && <p className="text-sm text-amber-400 mt-2">{error}</p>}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="p-5 rounded-2xl bg-gradient-to-r from-green-600/80 to-emerald-600/80 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <p className="text-sm text-slate-300">Approved Payouts</p>
            <h1 className="text-2xl font-bold mt-1">{loading ? "…" : formatInr(approvedTotal)}</h1>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-600/80 to-orange-500/80 border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <p className="text-sm text-slate-300">Pending Payout</p>
            <h1 className="text-2xl font-bold mt-1">{loading ? "…" : formatInr(totalPending)}</h1>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-600/80 to-red-500/80 border border-white/10 shadow-[0_0_20px_rgba(244,63,94,0.35)]">
            <p className="text-sm text-slate-300">Rejected</p>
            <h1 className="text-2xl font-bold mt-1">{loading ? "…" : formatInr(totalRejected)}</h1>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <p className="text-sm text-slate-300">Current Eligible</p>
            <h1 className="text-2xl font-bold mt-1">{loading ? "…" : formatInr(eligible)}</h1>
          </div>

        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* STATUS FILTER */}
          {(["all", "approved", "pending", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by request ID / amount / date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto sm:ml-auto px-3 py-1.5 rounded-lg bg-[#050816] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full min-w-[680px] text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">Request ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="px-4 text-left">Status</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <motion.tr
                  key={item.id || Math.random()}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  <td className="px-4 py-3 text-slate-300">{item.id || "-"}</td>
                  {/* AMOUNT */}
                  <td className="px-4 py-3 font-semibold text-green-400">
                    {formatInr(Number(item.amount || 0))}
                  </td>

                  {/* STATUS */}
                  <td className="px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "approved"
                          ? "bg-green-500/20 text-green-300"
                          : item.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-4 text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No payout records found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}