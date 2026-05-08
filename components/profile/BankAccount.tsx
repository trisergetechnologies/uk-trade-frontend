"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Landmark, Loader2, Pencil, Save } from "lucide-react";
import { getMyBankAccount, putMyBankAccount, type BankAccountDto } from "@/lib/api";

type BankForm = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
};

export default function BankAccount() {
  const [bank, setBank] = useState<BankAccountDto | null>(null);
  const [form, setForm] = useState<BankForm>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyBankAccount();
        if (cancelled) return;
        setBank(res.data);
        setForm({
          accountHolderName: res.data.accountHolderName || "",
          bankName: res.data.bankName || "",
          accountNumber: "",
          ifscCode: res.data.ifscCode || "",
          upiId: res.data.upiId || "",
        });
        if (!res.data.isComplete) setEditing(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load bank account");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await putMyBankAccount({
        accountHolderName: form.accountHolderName.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
        upiId: form.upiId.trim().toLowerCase() || "",
      });
      setBank(res.data);
      setForm((s) => ({ ...s, accountNumber: "" }));
      setEditing(false);
      setMessage("Bank account saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save bank account");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-slate-300 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading bank details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link href="/userdashboard/profile" className="text-sm text-slate-400 hover:text-white">
          ← Back to profile
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-indigo-300" />
          <h1 className="text-2xl font-semibold text-white">Bank account</h1>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          This is the bank account where withdrawal payouts are sent. We capture it during KYC and you can update it here at any time.
        </p>
      </div>

      {bank?.isComplete && !editing && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-sm text-white font-medium">{bank.accountHolderName}</p>
          </div>
          <p className="text-xs text-slate-300">
            {bank.bankName} • {bank.accountNumberMasked} • IFSC {bank.ifscCode}
          </p>
          {bank.upiId && <p className="text-xs text-slate-400">UPI: {bank.upiId}</p>}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit bank details
          </button>
        </div>
      )}

      {(editing || !bank?.isComplete) && (
        <form onSubmit={onSave} className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={form.accountHolderName}
              onChange={(e) => setForm((s) => ({ ...s, accountHolderName: e.target.value }))}
              placeholder="Account holder name"
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
              required
              minLength={2}
            />
            <input
              value={form.bankName}
              onChange={(e) => setForm((s) => ({ ...s, bankName: e.target.value }))}
              placeholder="Bank name"
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
              required
              minLength={2}
            />
            <input
              value={form.accountNumber}
              onChange={(e) => setForm((s) => ({ ...s, accountNumber: e.target.value.replace(/[^\d]/g, "") }))}
              placeholder="Account number"
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
              required
              minLength={6}
              inputMode="numeric"
            />
            <input
              value={form.ifscCode}
              onChange={(e) => setForm((s) => ({ ...s, ifscCode: e.target.value.toUpperCase() }))}
              placeholder="IFSC code"
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
              required
              minLength={4}
            />
            <input
              value={form.upiId}
              onChange={(e) => setForm((s) => ({ ...s, upiId: e.target.value }))}
              placeholder="UPI ID (optional)"
              className="sm:col-span-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save bank account
            </button>
            {bank?.isComplete && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setForm((s) => ({ ...s, accountNumber: "" }));
                }}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
