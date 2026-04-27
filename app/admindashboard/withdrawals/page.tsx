"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  apiFetch,
  getAdminWithdrawals,
  type PaginatedMeta,
  type WithdrawalRow,
  type WithdrawalStatusFilter,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 15;

function userLabel(row: WithdrawalRow) {
  const u = row.userId;
  if (u && typeof u === "object") {
    return u.name || u.email || String(u.id || u.userCode || "");
  }
  return "—";
}

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState<WithdrawalRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawalStatusFilter>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminWithdrawals(page, PAGE_SIZE, status);
      setRows(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load withdrawals";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const review = async (id: string, decision: "approved" | "rejected") => {
    await apiFetch(`/api/withdrawals/admin/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status: decision, reason: `Reviewed as ${decision}` }),
    });
    await load();
  };

  const totalPages = meta?.totalPages ?? 1;
  const pageAmountSum = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Withdrawals</h1>
          <p className="text-sm text-slate-400 mt-1">User payout requests (paginated).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WithdrawalStatusFilter)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[640px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No withdrawals found.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.04]">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-white">{userLabel(row)}</td>
                  <td className="px-4 py-3">{formatInr(row.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.status === "pending"
                          ? "bg-amber-500/15 text-amber-300"
                          : row.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-slate-400" title={row.reviewReason || ""}>
                    {row.reviewReason || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => review(row.id, "approved")}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => review(row.id, "rejected")}
                          className="rounded-lg bg-red-600/90 px-2 py-1 text-xs text-white hover:bg-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <div>
            <p>
              Page <span className="text-white">{meta.page}</span> of {totalPages} ·{" "}
              <span className="text-white">{meta.total}</span> total
            </p>
            <p className="text-xs text-slate-500 mt-1">Amount sum on this page: {formatInr(pageAmountSum)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:opacity-40 hover:bg-white/5"
            >
              <ChevronLeft size={18} />
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:opacity-40 hover:bg-white/5"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
