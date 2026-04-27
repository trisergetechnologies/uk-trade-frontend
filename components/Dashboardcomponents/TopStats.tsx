"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import {
  getIncomeMatching,
  getIncomeSponsor,
  getIncomeTrade,
  getMyPackages,
  getMyWithdrawalSummary,
  getWalletMe,
} from "@/lib/api";
import { totalIncomeAllTime } from "@/lib/incomeAggregates";
import { formatInr } from "@/lib/formatInr";

export default function TopStats() {
  const [balance, setBalance] = useState<number | null>(null);
  const [eligible, setEligible] = useState(0);
  const [tradeSum, setTradeSum] = useState(0);
  const [sponsorSum, setSponsorSum] = useState(0);
  const [matchingSum, setMatchingSum] = useState(0);
  const [withdrawApproved, setWithdrawApproved] = useState(0);
  const [invested, setInvested] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, tradeRes, sponsorRes, matchRes, wdSummary, pkgRes] = await Promise.all([
          getWalletMe(),
          getIncomeTrade(),
          getIncomeSponsor(),
          getIncomeMatching(),
          getMyWithdrawalSummary(),
          getMyPackages(),
        ]);
        if (cancelled) return;
        setBalance(walletRes.data?.balance ?? 0);
        setEligible(Number(walletRes.data?.eligibleToWithdraw) || 0);
        const { trade, sponsor, matching } = totalIncomeAllTime(
          tradeRes.data || [],
          sponsorRes.data || [],
          matchRes.data || []
        );
        setTradeSum(trade);
        setSponsorSum(sponsor);
        setMatchingSum(matching);
        setWithdrawApproved(Number(wdSummary.data?.approvedTotal) || 0);
        const inv = (pkgRes.data || []).reduce((s, r) => s + (Number(r.principalAmount) || 0), 0);
        setInvested(inv);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load stats");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalIncome = tradeSum + sponsorSum + matchingSum;

  if (error) {
    return (
      <p className="text-sm text-amber-400/90">
        Dashboard stats: {error}. Sign in and ensure the API gateway is running (
        <code className="text-xs">NEXT_PUBLIC_API_BASE</code>).
      </p>
    );
  }

  if (balance === null) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard title="Total Income" value={formatInr(totalIncome)} highlight />
      <StatCard title="Balance" value={formatInr(balance)} highlight />
      <StatCard title="Eligible to withdraw" value={formatInr(eligible)} />
      <StatCard title="Withdrawal (approved)" value={formatInr(withdrawApproved)} />
      <StatCard title="Investments" value={formatInr(invested)} />
    </div>
  );
}
