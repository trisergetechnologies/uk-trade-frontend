"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import {
  getMyPackages,
  getMyWithdrawalSummary,
  getWalletMe,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function TopStats() {
  const [loaded, setLoaded] = useState(false);
  const [eligible, setEligible] = useState(0);
  const [tradeCurrentCycle, setTradeCurrentCycle] = useState(0);
  const [sponsorAvailable, setSponsorAvailable] = useState(0);
  const [matchingAvailable, setMatchingAvailable] = useState(0);
  const [withdrawApproved, setWithdrawApproved] = useState(0);
  const [invested, setInvested] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, wdSummary, pkgRes] = await Promise.all([
          getWalletMe(),
          getMyWithdrawalSummary(),
          getMyPackages(),
        ]);
        if (cancelled) return;
        setEligible(Number(walletRes.data?.eligibleToWithdraw) || 0);
        setSponsorAvailable(Number(walletRes.data?.sponsorAvailable) || 0);
        setMatchingAvailable(Number(walletRes.data?.matchingAvailable) || 0);
        setTradeCurrentCycle(Number(walletRes.data?.tradeCurrentCycle) || 0);
        setWithdrawApproved(Number(wdSummary.data?.approvedTotal) || 0);
        const inv = (pkgRes.data || []).reduce((s, r) => s + (Number(r.principalAmount) || 0), 0);
        setInvested(inv);
        setLoaded(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load stats");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="text-sm text-amber-400/90">
        We couldn&apos;t load your stats right now. Please refresh the page or try again in a moment.
      </p>
    );
  }

  if (!loaded) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Trade income"
        value={formatInr(tradeCurrentCycle)}
        highlight
        hint="Current cycle — enters Eligible when cycle completes"
      />
      <StatCard
        title="Sponsor income"
        value={formatInr(sponsorAvailable)}
        highlight
        hint="Remaining now, after withdrawals"
      />
      <StatCard
        title="Matching income"
        value={formatInr(matchingAvailable)}
        highlight
        hint="Remaining now, after withdrawals"
      />
      <StatCard title="Eligible to withdraw" value={formatInr(eligible)} />
      <StatCard title="Withdrawal (approved)" value={formatInr(withdrawApproved)} />
      <StatCard title="Investments" value={formatInr(invested)} />
    </div>
  );
}
