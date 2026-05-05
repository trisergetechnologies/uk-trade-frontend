"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, UserRound, IndianRupee, FileText } from "lucide-react";
import { formatInr } from "@/lib/formatInr";
import { getAdminUserLookup, postAdminCreditUser } from "@/lib/api";

export default function AdminFundTransferPage() {
  const [toUserCode, setToUserCode] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolvedActive, setResolvedActive] = useState<boolean | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedCode = toUserCode.trim().toUpperCase();

  const runLookup = useCallback(async (code: string) => {
    if (code.length < 3) {
      setResolvedName(null);
      setResolvedActive(null);
      setLookupError(null);
      return;
    }
    try {
      setLookupError(null);
      const res = await getAdminUserLookup(code);
      setResolvedName(res.data.name);
      setResolvedActive(res.data.isActive);
    } catch {
      setResolvedName(null);
      setResolvedActive(null);
      setLookupError("User not found");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void runLookup(debouncedCode);
    }, 350);
    return () => clearTimeout(t);
  }, [debouncedCode, runLookup]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const amt = Number(amount);
    if (!debouncedCode || !Number.isFinite(amt) || amt <= 0) return;
    try {
      setSubmitting(true);
      await postAdminCreditUser(debouncedCode, { amount: amt, note: note.trim() || undefined });
      setSuccess(true);
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admindashboard/users"
          className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">Credit user wallet</h1>
          <p className="text-sm text-slate-400">Mint balance + eligible amount for a member (admin credit).</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Recipient user code</label>
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={toUserCode}
              onChange={(e) => setToUserCode(e.target.value.toUpperCase())}
              placeholder="USR…"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          {debouncedCode.length >= 3 && (
            <p className="mt-2 text-sm">
              {lookupError && <span className="text-amber-400">{lookupError}</span>}
              {!lookupError && resolvedName && (
                <span className="text-emerald-300">
                  {resolvedName}
                  {resolvedActive === false && (
                    <span className="text-amber-400 ml-2">(inactive)</span>
                  )}
                </span>
              )}
              {!lookupError && !resolvedName && debouncedCode.length >= 3 && (
                <span className="text-slate-500">Looking up…</span>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-2 block">Amount</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-2 block">Note (optional)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">Credit applied successfully.</p>}

        <button
          type="submit"
          disabled={submitting || !debouncedCode || !resolvedName}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={16} />
          {submitting ? "Processing…" : `Credit ${amount ? formatInr(Number(amount)) : "amount"}`}
        </button>
      </form>
    </div>
  );
}
