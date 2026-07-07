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

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "unverified", label: "Unverified" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

const KYC_DOC_LABELS: Record<KycDocumentKind, string> = {
  aadhaar: "Aadhaar",
  passbook: "Passbook / cheque",
  aadhaarFront: "Aadhaar front (legacy)",
  aadhaarBack: "Aadhaar back (legacy)",
  pan: "PAN (legacy)",
  photo: "Photo (legacy)",
};

const EMPTY_BANK = {
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
};

function bankFromRow(row: AdminKycRow | null) {
  if (!row?.bankAccount) return { ...EMPTY_BANK };
  return {
    accountHolderName: row.bankAccount.accountHolderName || "",
    bankName: row.bankAccount.bankName || "",
    accountNumber: row.bankAccount.accountNumber || "",
    ifscCode: row.bankAccount.ifscCode || "",
    upiId: row.bankAccount.upiId || "",
  };
}

function isBankFormComplete(bank: typeof EMPTY_BANK) {
  return Boolean(
    bank.accountHolderName.trim() &&
      bank.bankName.trim() &&
      bank.accountNumber.trim() &&
      bank.ifscCode.trim()
  );
}

function docButtonsForRow(row: AdminKycRow): { kind: KycDocumentKind; label: string }[] {
  const kinds = row.kyc.documents ?? [];
  return kinds.map((kind) => ({ kind, label: KYC_DOC_LABELS[kind] ?? kind }));
}

export default function AdminKycPage() {
  const [rows, setRows] = useState<AdminKycRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [directQuery, setDirectQuery] = useState("");
  const [directMatch, setDirectMatch] = useState<AdminKycRow | null>(null);
  const [directLookupLoading, setDirectLookupLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ userCode: string; kind: KycDocumentKind; url: string } | null>(null);
  const [reviewRow, setReviewRow] = useState<AdminKycRow | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [reviewReason, setReviewReason] = useState("");
  const [reviewBank, setReviewBank] = useState(EMPTY_BANK);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const isDirectApproval = reviewRow?.kyc.status === "unverified";

  function openReview(row: AdminKycRow, decision: "approved" | "rejected", reason: string) {
    setReviewRow(row);
    setReviewDecision(decision);
    setReviewReason(reason);
    setReviewBank(bankFromRow(row));
    setError("");
  }

  function closeReview() {
    setReviewRow(null);
    setReviewBank(EMPTY_BANK);
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const effectiveStatus = query.trim() ? "all" : status;
      const res = await getAdminKycList(page, PAGE_SIZE, effectiveStatus, query);
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load KYC list");
    } finally {
      setLoading(false);
    }
  }, [page, query, status]);

  useEffect(() => {
    const term = directQuery.trim();
    if (term.length < 2) {
      setDirectMatch(null);
      setDirectLookupLoading(false);
      return;
    }

    setDirectLookupLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await getAdminKycList(1, 5, "all", term);
        const exact = res.data?.find((row) => row.userCode.toUpperCase() === term.toUpperCase());
        setDirectMatch(exact || res.data?.[0] || null);
      } catch {
        setDirectMatch(null);
      } finally {
        setDirectLookupLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [directQuery]);

  async function openDirectApproval() {
    const term = directQuery.trim();
    if (term.length < 2) {
      setError("Enter a user code, name, or email to approve KYC directly.");
      return;
    }

    setError("");
    try {
      const res = await getAdminKycList(1, 5, "all", term);
      const exact = res.data?.find((row) => row.userCode.toUpperCase() === term.toUpperCase());
      const row = exact || res.data?.[0];
      if (!row) {
        setError("No member found for that search.");
        return;
      }
      if (!["unverified", "pending"].includes(row.kyc.status)) {
        setError(`KYC for ${row.name} is already ${row.kyc.status}.`);
        return;
      }
      openReview(
        row,
        "approved",
        row.kyc.status === "unverified"
          ? "KYC approved by admin without document submission."
          : "Documents verified."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find member.");
    }
  }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load document.");
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
          <p className="text-sm text-slate-400 mt-1">
            Review member identity documents or approve KYC directly by entering bank details for the member.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
        <div>
          <h2 className="text-sm font-medium text-white">Direct KYC approval</h2>
          <p className="text-xs text-slate-400 mt-1">
            Search any member and approve KYC without using the status filter below.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={directQuery}
            onChange={(e) => setDirectQuery(e.target.value)}
            placeholder="User code, name, or email"
            className="w-full sm:flex-1 rounded-lg border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            onClick={() => void openDirectApproval()}
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Approve directly
          </button>
        </div>
        {directLookupLoading ? (
          <p className="text-xs text-slate-500">Looking up member…</p>
        ) : directMatch ? (
          <p className="text-xs text-slate-400">
            Found: <span className="text-white">{directMatch.name}</span> ({directMatch.userCode}) · KYC{" "}
            <span className="text-slate-300">{directMatch.kyc.status}</span>
          </p>
        ) : directQuery.trim().length >= 2 ? (
          <p className="text-xs text-amber-400">No member found for this search.</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">Status</span>
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(opt.value);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                status === opt.value
                  ? "bg-indigo-600 text-white"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Search name, email, user code"
            className="w-full sm:max-w-sm rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
          {query.trim() ? (
            <p className="text-xs text-slate-500">Table search shows matches across all statuses.</p>
          ) : null}
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
              rows.map((row) => {
                const docButtons = docButtonsForRow(row);
                return (
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
                      docButtons.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {docButtons.map(({ kind, label }) => (
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
                        <span className="text-xs text-slate-500">No files on record</span>
                      )
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.kyc.status === "unverified" || row.kyc.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openReview(
                              row,
                              "approved",
                              row.kyc.status === "unverified"
                                ? "KYC approved by admin without document submission."
                                : "Documents verified."
                            )
                          }
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                        >
                          {row.kyc.status === "unverified" ? "Approve directly" : "Approve"}
                        </button>
                        {row.kyc.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => openReview(row, "rejected", "Please upload clearer images.")}
                            className="rounded-lg bg-red-600/90 px-2 py-1 text-xs text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        ) : null}
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
                {preview.userCode} · {KYC_DOC_LABELS[preview.kind] ?? preview.kind}
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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0b0f1a] p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-medium">
                {reviewDecision === "approved"
                  ? isDirectApproval
                    ? "Direct KYC approval"
                    : "Approve KYC"
                  : "Reject KYC"}
              </h3>
              <button onClick={closeReview} className="rounded p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {reviewRow.name} ({reviewRow.userCode})
            </p>
            {reviewDecision === "approved" ? (
              <>
                {isDirectApproval ? (
                  <p className="text-xs text-amber-300 mb-3">
                    This member has not submitted KYC documents. Enter bank details below and approve KYC without any
                    uploaded files.
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mb-3">
                    Confirm or update bank details before approving this submission.
                  </p>
                )}
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs text-slate-500">Account holder name</span>
                    <input
                      value={reviewBank.accountHolderName}
                      onChange={(e) => setReviewBank((b) => ({ ...b, accountHolderName: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs text-slate-500">Bank name</span>
                    <input
                      value={reviewBank.bankName}
                      onChange={(e) => setReviewBank((b) => ({ ...b, bankName: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Account number</span>
                    <input
                      value={reviewBank.accountNumber}
                      onChange={(e) => setReviewBank((b) => ({ ...b, accountNumber: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">IFSC code</span>
                    <input
                      value={reviewBank.ifscCode}
                      onChange={(e) => setReviewBank((b) => ({ ...b, ifscCode: e.target.value.toUpperCase() }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs text-slate-500">UPI ID (optional)</span>
                    <input
                      value={reviewBank.upiId}
                      onChange={(e) => setReviewBank((b) => ({ ...b, upiId: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </label>
                </div>
              </>
            ) : null}
            <textarea
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              placeholder={
                reviewDecision === "approved"
                  ? "Note to member (optional)"
                  : "Note to member (required)"
              }
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeReview} className="rounded border border-white/10 px-3 py-2 text-sm">
                Cancel
              </button>
              <button
                disabled={reviewSubmitting}
                onClick={async () => {
                  if (reviewDecision === "rejected" && (!reviewReason.trim() || reviewReason.trim().length < 2)) {
                    setError("Enter a rejection note (at least 2 characters).");
                    return;
                  }
                  if (reviewDecision === "approved" && !isBankFormComplete(reviewBank)) {
                    setError("Enter account holder, bank name, account number and IFSC before approving.");
                    return;
                  }
                  setReviewSubmitting(true);
                  setError("");
                  try {
                    await patchAdminKycReview(reviewRow.userCode, {
                      status: reviewDecision,
                      reason: reviewReason.trim() || undefined,
                      ...(reviewDecision === "approved"
                        ? {
                            accountHolderName: reviewBank.accountHolderName.trim(),
                            bankName: reviewBank.bankName.trim(),
                            accountNumber: reviewBank.accountNumber.trim(),
                            ifscCode: reviewBank.ifscCode.trim(),
                            upiId: reviewBank.upiId.trim() || undefined,
                          }
                        : {}),
                    });
                    closeReview();
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
