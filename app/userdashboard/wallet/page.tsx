"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Download, FileText, Wallet } from "lucide-react";
import { getWalletMe, type WalletDto } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function UserWalletPage() {
  const [wallet, setWallet] = useState<WalletDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getWalletMe();
        setWallet(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load wallet");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-1">
      <div className="flex items-start gap-3">
        <Wallet className="text-indigo-400 shrink-0 mt-1" size={28} />
        <div>
          <h1 className="text-2xl font-semibold text-white">Wallet</h1>
          <p className="text-slate-400 text-sm mt-1">Available balance and withdrawal eligibility.</p>
        </div>
      </div>

      {error && <p className="text-sm text-amber-400">{error}</p>}
      {loading && <p className="text-slate-500 text-sm">Loading…</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 p-6">
              <p className="text-xs uppercase tracking-wide text-indigo-200/80">Total balance</p>
              <p className="text-3xl font-bold text-white mt-2">{formatInr(wallet?.balance ?? 0)}</p>
              <p className="text-xs text-slate-400 mt-2">Funds in your wallet</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
              <p className="text-xs uppercase tracking-wide text-emerald-200/80">Eligible to withdraw</p>
              <p className="text-3xl font-bold text-white mt-2">{formatInr(wallet?.eligibleToWithdraw ?? 0)}</p>
              <p className="text-xs text-slate-400 mt-2">Amount available for payout requests</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/userdashboard/add-fund"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10"
            >
              Add fund
            </Link>
            <Link
              href="/userdashboard/fund-transfer/fund-transfer-to-user"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10"
            >
              <ArrowRightLeft size={16} />
              Transfer
            </Link>
            <Link
              href="/userdashboard/withdraw"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100 hover:bg-emerald-500/25"
            >
              <Download size={16} />
              Withdraw
            </Link>
            <Link
              href="/userdashboard/wallet-ledger"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-3 text-sm text-indigo-100 hover:bg-indigo-500/25"
            >
              <FileText size={16} />
              Ledger
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
