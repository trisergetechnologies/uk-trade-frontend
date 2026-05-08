"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, IdCard, ImageIcon, Landmark, Loader2, Upload } from "lucide-react";
import {
  getMyBankAccount,
  getMyKyc,
  getMyKycDocumentBlob,
  postKycSubmit,
  type KycDocumentKind,
  type KycSummary,
} from "@/lib/api";

const KYC_DOC_VIEWS: { kind: KycDocumentKind; label: string }[] = [
  { kind: "aadhaarFront", label: "Aadhaar front" },
  { kind: "aadhaarBack", label: "Aadhaar back" },
  { kind: "pan", label: "PAN" },
  { kind: "photo", label: "Photo" },
];

type BankForm = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
};

function statusLabel(s: KycSummary["status"]) {
  switch (s) {
    case "approved":
      return { text: "Approved", className: "bg-emerald-500/15 text-emerald-300" };
    case "pending":
      return { text: "Pending review", className: "bg-amber-500/15 text-amber-300" };
    case "rejected":
      return { text: "Rejected — upload again", className: "bg-red-500/15 text-red-300" };
    default:
      return { text: "Not submitted", className: "bg-slate-500/15 text-slate-300" };
  }
}

export default function KycSubmission() {
  const [summary, setSummary] = useState<KycSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bankForm, setBankForm] = useState<BankForm>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kycRes, bankRes] = await Promise.all([getMyKyc(), getMyBankAccount()]);
      setSummary(kycRes.data);
      const b = bankRes.data;
      setBankForm({
        accountHolderName: b.accountHolderName || "",
        bankName: b.bankName || "",
        accountNumber: "",
        ifscCode: b.ifscCode || "",
        upiId: b.upiId || "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load KYC");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function openPreview(kind: KycDocumentKind) {
    setPreviewKey(kind);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    try {
      const blob = await getMyKycDocumentBlob(kind);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setPreviewKey(null);
      setError("Could not load document preview.");
    }
  }

  function pickImage(file: File | null, setter: (f: File | null) => void) {
    setError(null);
    if (!file) {
      setter(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG or PNG).");
      return;
    }
    setter(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!aadhaarFront || !aadhaarBack || !pan || !photo) {
      setError("Please upload Aadhaar front, Aadhaar back, PAN, and your photo.");
      return;
    }
    const accountHolderName = bankForm.accountHolderName.trim();
    const bankName = bankForm.bankName.trim();
    const accountNumber = bankForm.accountNumber.trim();
    const ifscCode = bankForm.ifscCode.trim().toUpperCase();
    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      setError("Please fill in account holder, bank name, account number, and IFSC.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await postKycSubmit({
        aadhaarFront,
        aadhaarBack,
        pan,
        photo,
        bank: {
          accountHolderName,
          bankName,
          accountNumber,
          ifscCode,
          upiId: bankForm.upiId.trim().toLowerCase(),
        },
      });
      setSummary(res.data);
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPan(null);
      setPhoto(null);
      setBankForm((s) => ({ ...s, accountNumber: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  const st = summary?.status || "unverified";
  const badge = statusLabel(st);
  const canSubmit = st !== "approved" && st !== "pending";

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading KYC…
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link href="/userdashboard/profile" className="text-sm text-slate-400 hover:text-white">
          ← Back to profile
        </Link>
        <h1 className="text-2xl font-semibold text-white mt-4">KYC verification</h1>
        <p className="text-sm text-slate-400 mt-2">
          Upload Aadhaar front and back, PAN, and a clear photo of yourself. An admin must approve before you can request withdrawals.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Current status</p>
        <p className={`inline-flex mt-2 rounded-full px-3 py-1 text-sm font-medium ${badge.className}`}>{badge.text}</p>
        {summary?.reviewReason && st === "rejected" ? (
          <p className="text-sm text-red-300/90 mt-3">{summary.reviewReason}</p>
        ) : null}
        {st === "pending" ? (
          <p className="text-sm text-slate-400 mt-3">Your documents are under review. You can view uploads below.</p>
        ) : null}
        {st === "approved" ? (
          <p className="text-sm text-emerald-200/90 mt-3 flex items-center gap-2">
            <CheckCircle2 size={18} />
            You can request withdrawals from Finance → Withdraw.
          </p>
        ) : null}
      </div>

      {st !== "unverified" && st !== "rejected" ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
          <p className="text-sm text-slate-300 font-medium">Your uploads</p>
          <div className="flex flex-wrap gap-2">
            {KYC_DOC_VIEWS.map(({ kind, label }) => (
              <button
                key={kind}
                type="button"
                onClick={() => openPreview(kind)}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs text-indigo-300 hover:bg-white/5"
              >
                View {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {previewKey && previewUrl ? (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/10">
            <span className="text-sm text-slate-300">
              {KYC_DOC_VIEWS.find((d) => d.kind === previewKey)?.label ?? previewKey}
            </span>
            <button type="button" onClick={() => { setPreviewKey(null); setPreviewUrl(null); }} className="text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="max-h-[420px] w-full object-contain" />
        </div>
      ) : null}

      {canSubmit ? (
        <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">Submit documents</h2>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <label className="block space-y-2">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <IdCard size={16} /> Aadhaar — front side
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2">
              <Upload size={18} className="text-slate-500" />
              <input
                type="file"
                accept="image/*"
                className="text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white"
                onChange={(e) => pickImage(e.target.files?.[0] ?? null, setAadhaarFront)}
              />
            </span>
            {aadhaarFront ? <span className="text-xs text-slate-500">{aadhaarFront.name}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <IdCard size={16} /> Aadhaar — back side
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2">
              <Upload size={18} className="text-slate-500" />
              <input
                type="file"
                accept="image/*"
                className="text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white"
                onChange={(e) => pickImage(e.target.files?.[0] ?? null, setAadhaarBack)}
              />
            </span>
            {aadhaarBack ? <span className="text-xs text-slate-500">{aadhaarBack.name}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <IdCard size={16} /> PAN card (image)
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2">
              <Upload size={18} className="text-slate-500" />
              <input
                type="file"
                accept="image/*"
                className="text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white"
                onChange={(e) => pickImage(e.target.files?.[0] ?? null, setPan)}
              />
            </span>
            {pan ? <span className="text-xs text-slate-500">{pan.name}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <ImageIcon size={16} /> Your photo (selfie / passport-style)
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2">
              <Upload size={18} className="text-slate-500" />
              <input
                type="file"
                accept="image/*"
                className="text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white"
                onChange={(e) => pickImage(e.target.files?.[0] ?? null, setPhoto)}
              />
            </span>
            {photo ? <span className="text-xs text-slate-500">{photo.name}</span> : null}
          </label>

          <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <Landmark size={16} className="text-indigo-300" />
              Bank account for payouts
            </p>
            <p className="text-xs text-slate-500">
              We capture your bank details now (along with KYC) so withdrawals can be processed without delay.
              You can update them later from Profile → Bank.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={bankForm.accountHolderName}
                onChange={(e) => setBankForm((s) => ({ ...s, accountHolderName: e.target.value }))}
                placeholder="Account holder name"
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                required
                minLength={2}
              />
              <input
                value={bankForm.bankName}
                onChange={(e) => setBankForm((s) => ({ ...s, bankName: e.target.value }))}
                placeholder="Bank name"
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                required
                minLength={2}
              />
              <input
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm((s) => ({ ...s, accountNumber: e.target.value.replace(/[^\d]/g, "") }))}
                placeholder="Account number"
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                required
                minLength={6}
                inputMode="numeric"
              />
              <input
                value={bankForm.ifscCode}
                onChange={(e) => setBankForm((s) => ({ ...s, ifscCode: e.target.value.toUpperCase() }))}
                placeholder="IFSC code"
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                required
                minLength={4}
              />
              <input
                value={bankForm.upiId}
                onChange={(e) => setBankForm((s) => ({ ...s, upiId: e.target.value }))}
                placeholder="UPI ID (optional)"
                className="sm:col-span-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Uploading…" : "Submit for verification"}
          </button>
        </form>
      ) : null}

      {st === "pending" ? (
        <p className="text-xs text-slate-500 text-center">
          Need to replace files? Contact support or wait for the review result. If rejected, you can upload again here.
        </p>
      ) : null}
    </div>
  );
}
