"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getMyBankAccount,
  getMyKyc,
  getWalletMe,
  postWithdrawalRequest,
  putMyBankAccount,
  type BankAccountDto,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  History,
  IndianRupee,
  Landmark,
  Loader2,
  Pencil,
  Save,
  Send,
} from "lucide-react";

const MIN_AMOUNT = 500;

type BankForm = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
};

export default function SendWithdrawRequest() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [eligibleToWithdraw, setEligibleToWithdraw] = useState(0);
  const [bank, setBank] = useState<BankAccountDto | null>(null);
  const [bankForm, setBankForm] = useState<BankForm>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, bankRes, kycRes] = await Promise.all([getWalletMe(), getMyBankAccount(), getMyKyc()]);
        if (cancelled) return;
        setWalletBalance(Number(walletRes.data?.balance) || 0);
        setEligibleToWithdraw(Number(walletRes.data?.eligibleToWithdraw) || 0);
        setKycApproved(kycRes.data?.status === "approved");
        const bankData = bankRes.data;
        setBank(bankData);
        if (bankData?.isComplete) {
          setBankForm({
            accountHolderName: bankData.accountHolderName || "",
            bankName: bankData.bankName || "",
            accountNumber: "",
            ifscCode: bankData.ifscCode || "",
            upiId: bankData.upiId || "",
          });
        } else {
          setEditingBank(true);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load withdrawal data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const numericAmount = Number(amount || 0);
  const maxAllowed = Math.min(walletBalance, eligibleToWithdraw);
  const canRequest =
    kycApproved &&
    bank?.isComplete &&
    Number.isFinite(numericAmount) &&
    numericAmount >= MIN_AMOUNT &&
    numericAmount <= maxAllowed;

  const requestHint = useMemo(() => {
    if (!kycApproved)
      return "Complete KYC (Aadhaar front & back, PAN, photo) and wait for admin approval — see Account → KYC.";
    if (!bank?.isComplete) return "Save your bank account first.";
    if (!amount) return `Enter an amount between ${formatInr(MIN_AMOUNT)} and ${formatInr(maxAllowed)}.`;
    if (numericAmount < MIN_AMOUNT) return `Minimum withdrawal is ${formatInr(MIN_AMOUNT)}.`;
    if (numericAmount > maxAllowed)
      return `Amount cannot exceed eligible/wallet limit (${formatInr(maxAllowed)}).`;
    return "Request follows wallet + eligibility business rules.";
  }, [amount, bank?.isComplete, kycApproved, maxAllowed, numericAmount]);

  async function onSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSavingBank(true);
    try {
      const res = await putMyBankAccount({
        accountHolderName: bankForm.accountHolderName,
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        ifscCode: bankForm.ifscCode,
        upiId: bankForm.upiId || "",
      });
      setBank(res.data);
      setBankForm((prev) => ({ ...prev, accountNumber: "", ifscCode: prev.ifscCode.toUpperCase() }));
      setEditingBank(false);
      setMessage("Bank account saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save bank account");
    } finally {
      setSavingBank(false);
    }
  }

  async function onSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!canRequest) return;
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await postWithdrawalRequest({ amount: numericAmount });
      setAmount("");
      setMessage("Withdrawal request submitted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-slate-300 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading withdrawal details...
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/userdashboard/withdraw"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Withdraw Home
        </Link>
        <Link
          href="/userdashboard/withdraw/withdraw-histroy"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <History className="w-4 h-4" />
          Request History
        </Link>
        <Link
          href="/userdashboard/kyc"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-100 hover:bg-amber-500/20"
        >
          KYC
        </Link>
      </div>

      {!kycApproved && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Withdrawals are disabled until KYC is submitted and approved. Open <strong className="text-white">Account → KYC</strong> to upload Aadhaar front & back, PAN, and your photo.
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5">
        <h2 className="text-xl font-semibold text-white">Withdrawal Request</h2>
        <p className="text-sm text-slate-400 mt-1">
          We never bypass business logic. Request amount is validated against both wallet balance and eligible amount.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">Wallet Balance</p>
          <p className="text-xl font-semibold text-white">{formatInr(walletBalance)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">Eligible To Withdraw</p>
          <p className="text-xl font-semibold text-white">{formatInr(eligibleToWithdraw)}</p>
        </div>
      </div>

      <form onSubmit={onSaveBank} className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">1) Bank Account</h3>
          {bank?.isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        </div>
        {bank?.isComplete && !editingBank && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
            <p className="text-sm text-white font-medium">{bank.accountHolderName}</p>
            <p className="text-xs text-slate-300">
              {bank.bankName} • {bank.accountNumberMasked} • IFSC {bank.ifscCode}
            </p>
            {bank.upiId && <p className="text-xs text-slate-400">UPI: {bank.upiId}</p>}
            <button
              type="button"
              onClick={() => setEditingBank(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit bank details
            </button>
          </div>
        )}
        <div className={`grid sm:grid-cols-2 gap-3 ${bank?.isComplete && !editingBank ? "hidden" : ""}`}>
          <input
            value={bankForm.accountHolderName}
            onChange={(e) => setBankForm((s) => ({ ...s, accountHolderName: e.target.value }))}
            placeholder="Account holder name"
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
            required
          />
          <input
            value={bankForm.bankName}
            onChange={(e) => setBankForm((s) => ({ ...s, bankName: e.target.value }))}
            placeholder="Bank name"
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
            required
          />
          <input
            value={bankForm.accountNumber}
            onChange={(e) => setBankForm((s) => ({ ...s, accountNumber: e.target.value.replace(/[^\d]/g, "") }))}
            placeholder="Account number"
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
            required
          />
          <input
            value={bankForm.ifscCode}
            onChange={(e) => setBankForm((s) => ({ ...s, ifscCode: e.target.value.toUpperCase() }))}
            placeholder="IFSC code"
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
            required
          />
          <input
            value={bankForm.upiId}
            onChange={(e) => setBankForm((s) => ({ ...s, upiId: e.target.value }))}
            placeholder="UPI ID (optional)"
            className="sm:col-span-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
          />
        </div>
        <div className={`flex items-center gap-2 ${bank?.isComplete && !editingBank ? "hidden" : ""}`}>
          <button
            type="submit"
            disabled={savingBank}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {savingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Bank Account
          </button>
          {bank?.isComplete && (
            <button
              type="button"
              onClick={() => setEditingBank(false)}
              className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <form onSubmit={onSubmitRequest} className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">2) Request Withdrawal</h3>
        </div>
        <div className="relative max-w-sm">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="number"
            min={MIN_AMOUNT}
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min ${MIN_AMOUNT}`}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm text-white"
          />
        </div>
        <p className="text-xs text-slate-400">{requestHint}</p>
        <button
          type="submit"
          disabled={!canRequest || submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Withdrawal Request
        </button>
      </form>

      {error && <p className="text-sm text-rose-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </section>
  );
}