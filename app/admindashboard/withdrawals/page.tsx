"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  apiFetch,
  getAdminWithdrawals,
  type PaginatedMeta,
  type WithdrawalRow,
  type WithdrawalStatusFilter,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";
import { resolveWithdrawalDeductions } from "@/lib/withdrawalDeductions";

const PAGE_SIZE = 15;

function userLabel(row: WithdrawalRow) {
  const u = row.userId;
  if (u && typeof u === "object") {
    return u.name || u.email || String(u.id || u.userCode || "");
  }
  return "—";
}

function userDetails(row: WithdrawalRow) {
  const u = row.userId;
  if (u && typeof u === "object") {
    return {
      name: u.name?.trim() || "—",
      userCode: u.userCode?.trim() || "—",
      email: u.email?.trim() || "—",
    };
  }
  return { name: "—", userCode: "—", email: "—" };
}

function bankDetails(row: WithdrawalRow) {
  const b = row.bankSnapshot;
  const u = row.userId && typeof row.userId === "object" ? row.userId : null;
  const userBank = u?.bankAccount;
  const accountNumber =
    b?.accountNumber?.trim() ||
    userBank?.accountNumber?.trim() ||
    "";
  const hasAny = Boolean(
    b?.accountHolderName?.trim() ||
      b?.bankName?.trim() ||
      accountNumber ||
      b?.accountLast4?.trim() ||
      b?.ifscCode?.trim() ||
      b?.upiId?.trim() ||
      userBank?.accountHolderName?.trim()
  );
  if (!hasAny) return null;
  return {
    accountHolderName: b?.accountHolderName?.trim() || userBank?.accountHolderName?.trim() || "—",
    bankName: b?.bankName?.trim() || userBank?.bankName?.trim() || "—",
    accountNumber,
    accountLast4: b?.accountLast4?.trim() || accountNumber.slice(-4),
    ifscCode: b?.ifscCode?.trim() || userBank?.ifscCode?.trim() || "—",
    upiId: b?.upiId?.trim() || userBank?.upiId?.trim() || "",
  };
}

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState<WithdrawalRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawalStatusFilter>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reviewRow, setReviewRow] = useState<WithdrawalRow | null>(null);
  const [reviewReason, setReviewReason] = useState("");
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminWithdrawals(page, PAGE_SIZE, status, { q: query, from, to });
      setRows(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load withdrawals";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [from, page, query, status, to]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const review = async (id: string, decision: "approved" | "rejected", reason: string) => {
    const rid = id.trim();
    if (!rid) throw new Error("Missing withdrawal id");
    await apiFetch(`/api/withdrawals/admin/${encodeURIComponent(rid)}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status: decision, reason }),
    });
    await load();
  };

  const totalPages = meta?.totalPages ?? 1;
  const pageGrossSum = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const pageNetSum = rows.reduce((s, r) => s + resolveWithdrawalDeductions(r).netPayable, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Withdrawals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gross = wallet debit. Pay user the net amount after 5% TDS + 5% handling.
          </p>
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
          <input value={query} onChange={(e) => { setPage(1); setQuery(e.target.value); }} placeholder="Search request id or note" className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={from} onChange={(e) => { setPage(1); setFrom(e.target.value); }} type="date" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={to} onChange={(e) => { setPage(1); setTo(e.target.value); }} type="date" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[900px] text-left text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Gross</th>
              <th className="px-4 py-3">TDS</th>
              <th className="px-4 py-3">Handling</th>
              <th className="px-4 py-3">Net payable</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  No withdrawals found.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row, idx) => {
                const d = resolveWithdrawalDeductions(row);
                return (
                <tr key={row.id || `wd-${idx}`} className="border-b border-white/5 hover:bg-white/[0.04]">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-white">{userLabel(row)}</td>
                  <td className="px-4 py-3">{formatInr(d.amount)}</td>
                  <td className="px-4 py-3 text-amber-200/90">{formatInr(d.tdsAmount)}</td>
                  <td className="px-4 py-3 text-amber-200/90">{formatInr(d.handlingAmount)}</td>
                  <td className="px-4 py-3 text-emerald-300 font-medium">{formatInr(d.netPayable)}</td>
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
                          onClick={() => {
                            setReviewRow(row);
                            setReviewDecision("approved");
                            setReviewReason("Approved after verification.");
                          }}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReviewRow(row);
                            setReviewDecision("rejected");
                            setReviewReason("Rejected after verification.");
                          }}
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
              );
              })}
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
            <p className="text-xs text-slate-500 mt-1">
              Page gross: {formatInr(pageGrossSum)} · Net payable: {formatInr(pageNetSum)}
            </p>
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
            {reviewRow && (() => {
              const rd = resolveWithdrawalDeductions(reviewRow);
              const user = userDetails(reviewRow);
              const bank = bankDetails(reviewRow);
              return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b0f1a] p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-medium">{reviewDecision === "approved" ? "Approve" : "Reject"} withdrawal</h3>
              <button onClick={() => setReviewRow(null)} className="rounded p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="mb-3 rounded-lg border border-indigo-500/25 bg-indigo-500/10 p-3 text-xs space-y-2">
              <p className="text-[10px] uppercase tracking-wide text-indigo-300/90 font-medium">User</p>
              <p className="flex justify-between gap-3 text-slate-400">
                <span>Name</span>
                <span className="text-white text-right">{user.name}</span>
              </p>
              <p className="flex justify-between gap-3 text-slate-400">
                <span>User code</span>
                <span className="text-white font-mono text-right">{user.userCode}</span>
              </p>
              <p className="flex justify-between gap-3 text-slate-400">
                <span>Email</span>
                <span className="text-white text-right break-all">{user.email}</span>
              </p>
              <p className="flex justify-between gap-3 text-slate-400">
                <span>Request ID</span>
                <span className="text-white font-mono text-right">{reviewRow.id}</span>
              </p>
            </div>
            {bank ? (
              <div className="mb-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs space-y-2">
                <p className="text-[10px] uppercase tracking-wide text-emerald-300/90 font-medium">Payout bank account</p>
                <p className="flex justify-between gap-3 text-slate-400">
                  <span>Account holder</span>
                  <span className="text-white text-right">{bank.accountHolderName}</span>
                </p>
                <p className="flex justify-between gap-3 text-slate-400">
                  <span>Bank</span>
                  <span className="text-white text-right">{bank.bankName}</span>
                </p>
                <p className="flex justify-between gap-3 text-slate-400">
                  <span>Account number</span>
                  <span className="text-white font-mono text-right break-all">
                    {bank.accountNumber || (bank.accountLast4 ? `•••• ${bank.accountLast4} (partial — re-request withdrawal for full number)` : "—")}
                  </span>
                </p>
                <p className="flex justify-between gap-3 text-slate-400">
                  <span>IFSC</span>
                  <span className="text-white font-mono text-right">{bank.ifscCode}</span>
                </p>
                {bank.upiId ? (
                  <p className="flex justify-between gap-3 text-slate-400">
                    <span>UPI</span>
                    <span className="text-white text-right break-all">{bank.upiId}</span>
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                No bank snapshot on this request. Verify account in user profile before approving.
              </div>
            )}
            <div className="mb-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs space-y-1">
              <p className="flex justify-between text-slate-400"><span>Gross (wallet debit)</span><span className="text-white">{formatInr(rd.amount)}</span></p>
              <p className="flex justify-between text-slate-400"><span>TDS ({rd.tdsPercent}%)</span><span className="text-amber-200">− {formatInr(rd.tdsAmount)}</span></p>
              <p className="flex justify-between text-slate-400"><span>Handling ({rd.handlingPercent}%)</span><span className="text-amber-200">− {formatInr(rd.handlingAmount)}</span></p>
              <p className="flex justify-between border-t border-white/10 pt-2 font-medium text-slate-300">
                <span>Transfer to user</span>
                <span className="text-emerald-300">{formatInr(rd.netPayable)}</span>
              </p>
            </div>
            <textarea value={reviewReason} onChange={(e) => setReviewReason(e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Enter admin note" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReviewRow(null)} className="rounded border border-white/10 px-3 py-2 text-sm">Cancel</button>
              <button
                disabled={reviewSubmitting}
                onClick={async () => {
                  if (!reviewReason.trim()) {
                    setError("Note is required for withdrawal review.");
                    return;
                  }
                  setReviewSubmitting(true);
                  setError("");
                  try {
                    await review(reviewRow.id, reviewDecision, reviewReason.trim());
                    setReviewRow(null);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Withdrawal review failed");
                  } finally {
                    setReviewSubmitting(false);
                  }
                }}
                className="rounded bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {reviewSubmitting ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
              );
            })()}
    </div>
  );
}
