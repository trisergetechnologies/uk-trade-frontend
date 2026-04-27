"use client";

import { useEffect, useState } from "react";
import { Wallet, Users, Repeat, IndianRupee } from "lucide-react";
import { getIncomeMatching, getIncomeSponsor, getIncomeTrade } from "@/lib/api";
import { totalIncomeAllTime } from "@/lib/incomeAggregates";
import { formatInr } from "@/lib/formatInr";
import StatsSection from "@/components/ui/StatsSection";

export default function IncomeSection() {
  const [tradeTotal, setTradeTotal] = useState<number | null>(null);
  const [sponsorTotal, setSponsorTotal] = useState(0);
  const [matchingTotal, setMatchingTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tradeRes, sponsorRes, matchRes] = await Promise.all([
          getIncomeTrade(),
          getIncomeSponsor(),
          getIncomeMatching(),
        ]);
        if (cancelled) return;
        const { trade, sponsor, matching } = totalIncomeAllTime(
          tradeRes.data || [],
          sponsorRes.data || [],
          matchRes.data || []
        );
        setTradeTotal(trade);
        setSponsorTotal(sponsor);
        setMatchingTotal(matching);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load income");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = (tradeTotal ?? 0) + sponsorTotal + matchingTotal;

  const incomeStats =
    error || tradeTotal === null
      ? [
          {
            title: "Trade Income",
            value: error ? "—" : "…",
            icon: <IndianRupee size={18} />,
          },
          {
            title: "Sponsor Income",
            value: error ? "—" : "…",
            icon: <Users size={18} />,
          },
          {
            title: "Matching Income",
            value: "…",
            icon: <Repeat size={18} />,
          },
          {
            title: "Total Income",
            value: error ? "—" : "…",
            icon: <Wallet size={18} />,
            highlight: true,
          },
        ]
      : [
          {
            title: "Trade Income",
            value: formatInr(tradeTotal),
            icon: <IndianRupee size={18} />,
          },
          {
            title: "Sponsor Income",
            value: formatInr(sponsorTotal),
            icon: <Users size={18} />,
          },
          {
            title: "Matching Income",
            value: formatInr(matchingTotal),
            icon: <Repeat size={18} />,
          },
          {
            title: "Total Income",
            value: formatInr(total),
            icon: <Wallet size={18} />,
            highlight: true,
          },
        ];

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-amber-400/90">{error}</p>}
      <StatsSection title="Income" stats={incomeStats} />
    </div>
  );
}
