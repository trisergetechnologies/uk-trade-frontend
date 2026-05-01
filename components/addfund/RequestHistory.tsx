"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { getMyFundRequests, type FundRequestRow, type PaginatedMeta } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 10;

function statusLabel(status: FundRequestRow["status"]) {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  return "Rejected";
}

export default function RequestHistory() {
  const [rows, setRows] = useState<FundRequestRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyFundRequests(page, PAGE_SIZE);
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const total = rows.reduce((s, r) => s + (Number(r.requestedAmount) || 0), 0);
  const approvedSum = rows
    .filter((r) => r.status === "approved")
    .reduce((s, r) => s + (Number(r.approvedAmount ?? r.requestedAmount) || 0), 0);
  const pendingSum = rows.filter((r) => r.status === "pending").reduce((s, r) => s + r.requestedAmount, 0);

  const statusConfig = (status: string) => {
    switch (status) {
      case "Approved":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          icon: <CheckCircle size={16} />,
        };
      case "Pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: <Clock size={16} />,
        };
      default:
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: <XCircle size={16} />,
        };
    }
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <section className="relative w-full py-10 px-3 md:py-16 md:px-4 flex justify-center">
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-5xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-4 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Link
                href="/userdashboard"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
              >
                <ArrowLeft size={18} aria-hidden />
                Dashboard
              </Link>
              <Link
                href="/userdashboard/add-fund"
                className="inline-flex items-center gap-1.5 text-sm text-indigo-300/90 hover:text-indigo-200"
              >
                <Wallet size={16} aria-hidden />
                New add-fund request
              </Link>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Finance · Add fund</p>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Request history</h2>
              <p className="text-slate-400 mt-2 text-sm">Status of each payment you submitted for admin approval.</p>
            </div>
            {error && <p className="text-sm text-amber-400">{error}</p>}
          </div>
          {meta && meta.total > 0 && (
            <div className="mb-6 flex justify-end">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-xs text-slate-500 mr-1">Page</span>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-white/10 px-2 py-1 text-white disabled:opacity-40 hover:bg-white/5"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-white/10 px-2 py-1 text-white disabled:opacity-40 hover:bg-white/5"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs">This page total</p>
              <p className="text-white font-semibold text-lg">{formatInr(total)}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-400 text-xs">Approved (page)</p>
              <p className="text-white font-semibold text-lg">{formatInr(approvedSum)}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-yellow-400 text-xs">Pending (page)</p>
              <p className="text-white font-semibold text-lg">{formatInr(pendingSum)}</p>
            </div>
          </div>

          <div className="space-y-5">
            {loading && <p className="text-slate-400 text-sm">Loading…</p>}
            {!loading && !rows.length && !error && (
              <p className="text-slate-400 text-sm">No fund requests yet.</p>
            )}
            {rows.map((item, i) => {
              const label = statusLabel(item.status);
              const status = statusConfig(label);
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "—";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col min-w-0">
                    <p className="text-white font-semibold text-xl">{formatInr(item.requestedAmount)}</p>
                    <p className="text-slate-400 text-xs mt-1 truncate">{dateStr}</p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${status.bg} ${status.color} ${status.border}`}
                  >
                    {status.icon}
                    {label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {meta && meta.total > 0 && (
            <p className="mt-8 text-center text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, meta.total)} of {meta.total} requests
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
