"use client";

import { useEffect, useState } from "react";
import StatsSection from "@/components/ui/StatsSection";
import { Calendar, IndianRupee } from "lucide-react";
import { getIncomeMatching, getIncomeSponsor, getIncomeTrade } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";
import { getTodayIstYmd } from "@/lib/istDate";
import {
  sumMatchingOnIstDate,
  sumSponsorCreditedOnIstDate,
  sumTradeOnIstDate,
} from "@/lib/incomeAggregates";

export default function TodaySection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradeToday, setTradeToday] = useState(0);
  const [sponsorToday, setSponsorToday] = useState(0);
  const [matchingToday, setMatchingToday] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const today = getTodayIstYmd();
        const [tradeRes, sponsorRes, matchRes] = await Promise.all([
          getIncomeTrade(),
          getIncomeSponsor(),
          getIncomeMatching(),
        ]);
        if (cancelled) return;
        const tt = sumTradeOnIstDate(tradeRes.data || [], today);
        const st = sumSponsorCreditedOnIstDate(sponsorRes.data || [], today);
        const mt = sumMatchingOnIstDate(matchRes.data || [], today);
        setTradeToday(tt);
        setSponsorToday(st);
        setMatchingToday(mt);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load today income (IST)");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = tradeToday + sponsorToday + matchingToday;
  const placeholder = "—";

  const todayStats = [
    {
      title: "Today Trade Income",
      value: loading && !error ? "…" : error ? placeholder : formatInr(tradeToday),
      icon: <IndianRupee size={18} />,
    },
    {
      title: "Today Sponsor Income",
      value: loading && !error ? "…" : error ? placeholder : formatInr(sponsorToday),
      icon: <IndianRupee size={18} />,
    },
    {
      title: "Today Matching Income",
      value: loading && !error ? "…" : error ? placeholder : formatInr(matchingToday),
      icon: <IndianRupee size={18} />,
    },
    {
      title: "Today Total Income",
      value: loading && !error ? "…" : error ? placeholder : formatInr(total),
      icon: <Calendar size={18} />,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-amber-400/90">{error}</p>}
      <StatsSection title="Today (IST)" stats={todayStats} />
    </div>
  );
}
