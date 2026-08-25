"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getMyBankAccount,
  getWalletMe,
  postWithdrawalRequest,
  type BankAccountDto,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";
import { computeWithdrawalDeductions } from "@/lib/withdrawalDeductions";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  History,
  IndianRupee,
  Landmark,
  Loader2,
  Send,
} from "lucide-react";

const MIN_AMOUNT = 500;

export default function SendWithdrawRequest() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [eligibleToWithdraw, setEligibleToWithdraw] = useState(0);
  const [bank, setBank] = useState<BankAccountDto | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, bankRes] = await Promise.all([getWalletMe(), getMyBankAccount()]);
        if (cancelled) return;
        setWalletBalance(Number(walletRes.data?.balance) || 0);
        setEligibleToWithdraw(Number(walletRes.data?.eligibleToWithdraw) || 0);
        setBank(bankRes.data);
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
  const deductions = useMemo(
    () => (numericAmount > 0 ? computeWithdrawalDeductions(numericAmount) : null),
    [numericAmount]
  );
  const canRequest =
    Number.isFinite(numericAmount) &&
    numericAmount >= MIN_AMOUNT &&
    numericAmount <= maxAllowed;

  const requestHint = useMemo(() => {
    if (!amount) return `Enter an amount between ${formatInr(MIN_AMOUNT)} and ${formatInr(maxAllowed)}.`;
    if (numericAmount < MIN_AMOUNT) return `Minimum withdrawal is ${formatInr(MIN_AMOUNT)}.`;
    if (numericAmount > maxAllowed)
      return `Amount cannot exceed eligible/wallet limit (${formatInr(maxAllowed)}).`;
    if (!bank?.isComplete)
      return "Bank details are optional — admin can collect them later if missing.";
    return "Request follows wallet + eligibility business rules.";
  }, [amount, bank?.isComplete, maxAllowed, numericAmount]);

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
          href="/userdashboard/profile/bank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-indigo-100 hover:bg-indigo-500/20"
        >
          <Landmark className="w-4 h-4" />
          Manage Bank
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5">
        <h2 className="text-xl font-semibold text-white">Withdrawal Request</h2>
        <p className="text-sm text-slate-400 mt-1">
          Request amount is validated against wallet balance and eligible amount. A 5% TDS and 5% handling
          charge (10% total) are deducted from each withdrawal; the net amount is paid after approval.
          KYC is not required.
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

      <div className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Bank account on file</h3>
          {bank?.isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        </div>
        {bank?.isComplete ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
            <p className="text-sm text-white font-medium">{bank.accountHolderName}</p>
            <p className="text-xs text-slate-300">
              {bank.bankName} • {bank.accountNumberMasked} • IFSC {bank.ifscCode}
            </p>
            {bank.upiId && <p className="text-xs text-slate-400">UPI: {bank.upiId}</p>}
            <Link
              href="/userdashboard/profile/bank"
              className="mt-1 inline-block text-xs text-indigo-300 hover:text-indigo-200"
            >
              Edit in Profile → Bank
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 space-y-2">
            <p>
              No bank account on file. You can still submit a request — admin may ask for account details
              before payout. Or add them now in Profile → Bank.
            </p>
            <Link
              href="/userdashboard/profile/bank"
              className="inline-block text-xs text-amber-200 hover:text-white underline"
            >
              Go to Profile → Bank
            </Link>
          </div>
        )}
      </div>

      <form onSubmit={onSubmitRequest} className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Request Withdrawal</h3>
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
        {deductions && numericAmount >= MIN_AMOUNT && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-1.5 max-w-sm">
            <div className="flex justify-between text-slate-400">
              <span>Requested (gross)</span>
              <span className="text-white">{formatInr(numericAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TDS ({deductions.tdsPercent}%)</span>
              <span className="text-amber-200">− {formatInr(deductions.tdsAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Handling ({deductions.handlingPercent}%)</span>
              <span className="text-amber-200">− {formatInr(deductions.handlingAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-medium">
              <span className="text-slate-300">You receive (net)</span>
              <span className="text-emerald-300">{formatInr(deductions.netPayable)}</span>
            </div>
          </div>
        )}
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
