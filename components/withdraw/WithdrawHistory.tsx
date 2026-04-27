"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Wallet,
  Send,
} from "lucide-react";
import { getMyWithdrawals, type PaginatedMeta, type WithdrawalRow, type WithdrawalStatusFilter } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 10;

type UiStatus = "Pending" | "Approved" | "Rejected";

function toUi(row: WithdrawalRow): { id: string; amount: string; method: string; status: UiStatus; date: string } {
  const s: UiStatus =
    row.status === "pending" ? "Pending" : row.status === "approved" ? "Approved" : "Rejected";
  return {
    id: row.id,
    amount: formatInr(row.amount),
    method: row.bankSnapshot?.accountLast4
      ? `${row.bankSnapshot.bankName || "Bank"} ••••${row.bankSnapshot.accountLast4}`
      : "—",
    status: s,
    date: row.createdAt || new Date().toISOString(),
  };
}

export default function WithdrawHistory() {
  const [raw, setRaw] = useState<WithdrawalRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatusFilter | "all">("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const apiStatus: WithdrawalStatusFilter =
    statusFilter === "all" ? "" : (statusFilter as WithdrawalStatusFilter);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getMyWithdrawals(page, PAGE_SIZE, apiStatus);
      setRaw(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  }, [page, apiStatus]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const rows = raw.map(toUi);
  const totalPages = meta?.totalPages ?? 1;
  const pageAmountSum = raw.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const statusConfig = {
    Approved: {
      icon: CheckCircle,
      style: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    Pending: {
      icon: Clock,
      style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    Rejected: {
      icon: XCircle,
      style: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  return (
    <section className="relative w-full py-16 px-4 flex justify-center">
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-6xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)] overflow-hidden">
          <div className="px-8 pt-6 pb-2 flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/userdashboard/withdraw"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Withdraw Home
            </Link>
            <Link
              href="/userdashboard/withdraw/send-request"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <Send className="w-4 h-4" />
              New Withdrawal Request
            </Link>
          </div>
          <div className="p-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Wallet className="text-indigo-400" />
                  Withdrawal History
                </h2>
                <p className="text-slate-400 text-sm mt-1">Paginated from your account.</p>
                {loadError && <p className="text-sm text-amber-400 mt-2">{loadError}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="appearance-none pl-4 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-w-[160px]"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                {meta && meta.total > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-white/10 p-2 text-white disabled:opacity-40 hover:bg-white/5"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="tabular-nums min-w-[4.5rem] text-center">
                      {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-white/10 p-2 text-white disabled:opacity-40 hover:bg-white/5"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-6">Amount</th>
                  <th className="text-left py-4 px-6">Note / reason</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="py-6 px-6 text-slate-400">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && !rows.length && (
                  <tr>
                    <td colSpan={4} className="py-6 px-6 text-slate-400">
                      No withdrawals yet.
                    </td>
                  </tr>
                )}
                {rows.map((item, i) => {
                  const StatusIcon = statusConfig[item.status].icon;
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-6 text-white font-medium">{item.amount}</td>
                      <td className="py-4 px-6 text-slate-400">{item.method}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status].style}`}
                        >
                          <StatusIcon size={14} />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-white/10 text-xs text-slate-500 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <span>
              {meta && meta.total > 0
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, meta.total)} of ${meta.total}`
                : "No rows"}
            </span>
            <span className="text-white font-medium">This page total: {formatInr(pageAmountSum)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
