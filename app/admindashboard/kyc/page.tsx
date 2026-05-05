"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  getAdminKycDocumentBlob,
  getAdminKycList,
  patchAdminKycReview,
  type AdminKycRow,
  type KycDocumentKind,
  type KycSummary,
  type PaginatedMeta,
} from "@/lib/api";

const PAGE_SIZE = 15;

const ADMIN_KYC_DOCS: { kind: KycDocumentKind; label: string }[] = [
  { kind: "aadhaarFront", label: "Aadhaar front" },
  { kind: "aadhaarBack", label: "Aadhaar back" },
  { kind: "pan", label: "PAN" },
  { kind: "photo", label: "Photo" },
];

export default function AdminKycPage() {
  const [rows, setRows] = useState<AdminKycRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "unverified" | "all">("pending");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ userCode: string; kind: KycDocumentKind; url: string } | null>(null);
  const [reviewRow, setReviewRow] = useState<AdminKycRow | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [reviewReason, setReviewReason] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminKycList(page, PAGE_SIZE, status, query);
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load KYC list");
    } finally {
      setLoading(false);
    }
  }, [page, query, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  async function openDoc(userCode: string, kind: KycDocumentKind) {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    try {
      const blob = await getAdminKycDocumentBlob(userCode, kind);
      setPreview({ userCode, kind, url: URL.createObjectURL(blob) });
    } catch {
      setError("Could not load document.");
    }
  }

  function kycBadge(s: KycSummary["status"]) {
    if (s === "approved") return "bg-emerald-500/15 text-emerald-300";
    if (s === "pending") return "bg-amber-500/15 text-amber-300";
    if (s === "rejected") return "bg-red-500/15 text-red-300";
    return "bg-slate-500/15 text-slate-300";
  }

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">KYC</h1>
          <p className="text-sm text-slate-400 mt-1">Review member identity documents. Approve before they can withdraw.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="unverified">Unverified</option>
            <option value="all">All</option>
          </select>
          <input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Search name, email, user code"
            className="w-full sm:w-56 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[720px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">User code</th>
              <th className="px-4 py-3">KYC status</th>
              <th className="px-4 py-3">Documents</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No records.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.userCode} className="border-b border-white/5 hover:bg-white/[0.04]">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{row.userCode}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${kycBadge(row.kyc.status)}`}>
                      {row.kyc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {["pending", "approved", "rejected"].includes(row.kyc.status) ? (
                      <div className="flex flex-wrap gap-1">
                        {ADMIN_KYC_DOCS.map(({ kind, label }) => (
                          <button
                            key={kind}
                            type="button"
                            onClick={() => openDoc(row.userCode, kind)}
                            className="rounded border border-white/15 px-2 py-0.5 text-xs text-indigo-300 hover:bg-white/10"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.kyc.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewRow(row);
                            setReviewDecision("approved");
                            setReviewReason("Documents verified.");
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
                            setReviewReason("Please upload clearer images.");
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
              ))}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>
            Page <span className="text-white">{meta.page}</span> of {totalPages} · <span className="text-white">{meta.total}</span> total
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

      {preview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-3xl w-full max-h-[90vh] rounded-xl border border-white/10 bg-[#0b0f1a] flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
              <span className="text-sm text-white">
                {preview.userCode} · {ADMIN_KYC_DOCS.find((d) => d.kind === preview.kind)?.label ?? preview.kind}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (preview.url) URL.revokeObjectURL(preview.url);
                  setPreview(null);
                }}
                className="rounded p-1 hover:bg-white/10"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="" className="max-h-[75vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      ) : null}

      {reviewRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b0f1a] p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-medium">{reviewDecision === "approved" ? "Approve KYC" : "Reject KYC"}</h3>
              <button onClick={() => setReviewRow(null)} className="rounded p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {reviewRow.name} ({reviewRow.userCode})
            </p>
            <textarea
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              placeholder="Note to member (required)"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReviewRow(null)} className="rounded border border-white/10 px-3 py-2 text-sm">
                Cancel
              </button>
              <button
                disabled={reviewSubmitting}
                onClick={async () => {
                  if (!reviewReason.trim() || reviewReason.trim().length < 2) {
                    setError("Enter a note (at least 2 characters).");
                    return;
                  }
                  setReviewSubmitting(true);
                  setError("");
                  try {
                    await patchAdminKycReview(reviewRow.userCode, {
                      status: reviewDecision,
                      reason: reviewReason.trim(),
                    });
                    setReviewRow(null);
                    await load();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Review failed");
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
      ) : null}
    </div>
  );
}
