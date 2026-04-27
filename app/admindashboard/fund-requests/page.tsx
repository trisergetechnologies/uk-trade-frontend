"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { apiFetch, getAdminFundRequestDetail, getAdminFundRequests, getAdminPaymentProofBlob } from "@/lib/api";
import type { AdminFundRequestDetail, AuditLogRow, FundRequestRow, PaginatedMeta } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 15;

function userLabel(row: FundRequestRow) {
  const u = row.userId;
  if (u && typeof u === "object") {
    return u.name || u.email || String(u.id || u.userCode || "");
  }
  return "—";
}

export default function AdminFundRequestsPage() {
  const [rows, setRows] = useState<FundRequestRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminFundRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [approveRow, setApproveRow] = useState<FundRequestRow | null>(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [approveReason, setApproveReason] = useState("");
  const [approveSubmitting, setApproveSubmitting] = useState(false);
  const [proofOpenId, setProofOpenId] = useState<string | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string>("");
  const [proofLoading, setProofLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminFundRequests(page, PAGE_SIZE);
      setRows(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load fund requests";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (id: string) => {
    setDetailId(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await getAdminFundRequestDetail(id);
      setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailId(null);
    setDetail(null);
  };

  const openApprove = (row: FundRequestRow) => {
    setApproveRow(row);
    setApprovedAmount(String(row.requestedAmount));
    setApproveReason("");
  };

  const closeApprove = () => {
    setApproveRow(null);
    setApprovedAmount("");
    setApproveReason("");
  };

  const submitApprove = async () => {
    if (!approveRow) return;
    const amt = Number.parseFloat(approvedAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Approved amount must be a positive number.");
      return;
    }
    const differs = Math.abs(amt - approveRow.requestedAmount) > 0.01;
    if (differs && !approveReason.trim()) {
      setError("Reason is required when the approved amount differs from the requested amount.");
      return;
    }
    setApproveSubmitting(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        status: "approved",
        reason: approveReason.trim() || `Approved at ${formatInr(amt)}`,
      };
      if (differs) body.approvedAmount = amt;
      await apiFetch(`/api/fund-requests/admin/${approveRow.id}/review`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      closeApprove();
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setApproveSubmitting(false);
    }
  };

  const reject = async (id: string) => {
    await apiFetch(`/api/fund-requests/admin/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", reason: "Rejected by admin" }),
    });
    await load();
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payment requests</h1>
        <p className="text-sm text-slate-400 mt-1">Pending and past add-fund submissions (paginated).</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[800px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Proof</th>
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
                  No requests found.
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
                  <td className="px-4 py-3">{formatInr(row.requestedAmount)}</td>
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
                  <td className="px-4 py-3">
                    {row.paymentProofPath ? (
                      <button
                        type="button"
                        onClick={async () => {
                          setProofOpenId(row.id);
                          setProofLoading(true);
                          setProofPreviewUrl("");
                          try {
                            const blob = await getAdminPaymentProofBlob(row.id);
                            setProofPreviewUrl(URL.createObjectURL(blob));
                          } finally {
                            setProofLoading(false);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
                      >
                        View
                      </button>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(row.id)}
                        className="rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                      >
                        Detail
                      </button>
                      {row.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => openApprove(row)}
                            className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                          >
                            Approve…
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(row.id)}
                            className="rounded-lg bg-red-600/90 px-2 py-1 text-xs text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>
            Page <span className="text-white">{meta.page}</span> of {totalPages} ·{" "}
            <span className="text-white">{meta.total}</span> total
          </p>
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

      {detailId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#0b0f1a] p-6 text-slate-200 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white">Request detail</h2>
              <button type="button" onClick={closeDetail} className="rounded p-1 hover:bg-white/10" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {detailLoading && <p className="text-sm text-slate-400">Loading…</p>}
            {!detailLoading && detail && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Requested</p>
                  <p className="text-white font-medium">{formatInr(detail.request.requestedAmount)}</p>
                </div>
                {detail.request.reviewMetadata && (
                  <div>
                    <p className="text-slate-500">Review metadata</p>
                    <pre className="mt-1 rounded bg-black/40 p-2 text-xs overflow-x-auto">
                      {JSON.stringify(detail.request.reviewMetadata, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 mb-1">Audit ({detail.audit.length})</p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {detail.audit.map((a: AuditLogRow) => (
                      <li key={a.id} className="rounded border border-white/10 p-2 text-xs">
                        <span className="text-slate-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}</span>{" "}
                        <span className="text-indigo-300">{a.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {approveRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b0f1a] p-6 text-slate-200 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white">Approve payment</h2>
              <button type="button" onClick={closeApprove} className="rounded p-1 hover:bg-white/10" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Requested: {formatInr(approveRow.requestedAmount)}. You may credit a different amount; if you do, enter a
              reason.
            </p>
            <label className="block text-xs text-slate-500 mb-1">Approved amount (INR)</label>
            <input
              type="number"
              min={1}
              step="1"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white mb-4"
            />
            <label className="block text-xs text-slate-500 mb-1">Reason (required if amount differs)</label>
            <textarea
              value={approveReason}
              onChange={(e) => setApproveReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeApprove}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={approveSubmitting}
                onClick={() => void submitApprove()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50 hover:bg-emerald-500"
              >
                {approveSubmitting ? "Saving…" : "Confirm approve"}
              </button>
            </div>
          </div>
        </div>
      )}
      {proofOpenId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-[#0b0f1a] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-medium">Payment proof</h3>
              <button onClick={() => { setProofOpenId(null); if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl); setProofPreviewUrl(""); }} className="rounded p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            {proofLoading && <p className="text-slate-400 text-sm">Loading proof…</p>}
            {!proofLoading && proofPreviewUrl && (
              <Image src={proofPreviewUrl} alt="Payment proof" width={1200} height={900} unoptimized className="max-h-[75vh] w-auto rounded border border-white/10" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
