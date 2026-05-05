"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, History, IdCard, Landmark, Loader2, Wallet } from "lucide-react";
import { getMyBankAccount, getMyKyc, getWalletMe } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function WithdrawHome() {
  const [balance, setBalance] = useState(0);
  const [eligible, setEligible] = useState(0);
  const [bankReady, setBankReady] = useState(false);
  const [kycApproved, setKycApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, bankRes, kycRes] = await Promise.all([getWalletMe(), getMyBankAccount(), getMyKyc()]);
        if (cancelled) return;
        setBalance(Number(walletRes.data?.balance) || 0);
        setEligible(Number(walletRes.data?.eligibleToWithdraw) || 0);
        setBankReady(Boolean(bankRes.data?.isComplete));
        setKycApproved(kycRes.data?.status === "approved");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-6">
        <h2 className="text-2xl font-semibold text-white">Withdraw Funds</h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete KYC verification, add your bank account, then request withdrawals based on eligible amount.
        </p>
      </div>

      {!loading && !kycApproved && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>KYC must be approved before you can withdraw.</span>
          <Link
            href="/userdashboard/kyc"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600/90 px-3 py-2 text-white text-xs font-medium hover:bg-amber-500 shrink-0"
          >
            <IdCard className="w-4 h-4" />
            Go to KYC
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">Wallet Balance</p>
          <p className="text-lg text-white font-semibold">{formatInr(balance)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">Eligible To Withdraw</p>
          <p className="text-lg text-white font-semibold">{formatInr(eligible)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">Bank Account</p>
          <p className={`text-sm font-medium ${bankReady ? "text-emerald-400" : "text-amber-400"}`}>
            {bankReady ? "Configured" : "Not added"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">KYC</p>
          <p className={`text-sm font-medium ${kycApproved ? "text-emerald-400" : "text-amber-400"}`}>
            {kycApproved ? "Approved" : "Required"}
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-slate-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/userdashboard/withdraw/send-request"
          className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-5 hover:bg-indigo-500/15 transition"
        >
          <div className="flex items-center gap-2 text-white font-medium">
            <ArrowUpRight className="w-4 h-4" />
            Request Withdrawal
          </div>
          <p className="text-xs text-slate-300 mt-2">Uses saved bank account by default. Edit only when needed.</p>
        </Link>
        <Link
          href="/userdashboard/withdraw/withdraw-histroy"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition"
        >
          <div className="flex items-center gap-2 text-white font-medium">
            <History className="w-4 h-4" />
            Withdrawal History
          </div>
          <p className="text-xs text-slate-400 mt-2">Track pending, approved, and rejected requests.</p>
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400 flex items-center gap-2">
        <Landmark className="w-4 h-4 text-indigo-400" />
        Requests are only accepted when amount is within both wallet balance and eligible-to-withdraw limits.
      </div>
    </section>
  );
}