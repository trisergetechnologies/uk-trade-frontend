"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Users, Layers, ArrowUpRight, CalendarDays } from "lucide-react";
import { getIncomeMatching, getIncomeSponsor, getIncomeTrade, type MatchingIncomeRow, type SponsorIncomeRow, type TradeCreditRow } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function IncomeHome() {
  const [tradeRows, setTradeRows] = useState<TradeCreditRow[]>([]);
  const [sponsorRows, setSponsorRows] = useState<SponsorIncomeRow[]>([]);
  const [matchingRows, setMatchingRows] = useState<MatchingIncomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [t, s, m] = await Promise.all([getIncomeTrade(), getIncomeSponsor(), getIncomeMatching()]);
        if (cancelled) return;
        setTradeRows(t.data || []);
        setSponsorRows(s.data || []);
        setMatchingRows(m.data || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load income");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tradeTotal = tradeRows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const sponsorTotal = sponsorRows.reduce((acc, r) => acc + (Number(r.creditedAmount) || 0), 0);
  const matchingTotal = matchingRows.reduce(
    (acc, r) => acc + (Number(r.payoutCreditedAmount ?? r.creditedAmount ?? r.amount) || 0),
    0
  );
  const total = tradeTotal + sponsorTotal + matchingTotal;
  const latestDate = [
    ...tradeRows.map((r) => r.createdAt || r.creditDateIst || ""),
    ...sponsorRows.map((r) => r.createdAt || ""),
    ...matchingRows.map((r) => r.createdAt || r.creditDateIst || ""),
  ]
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const incomeCards = [
    {
      title: "Trade income",
      desc: "Daily trade credits",
      href: "/userdashboard/income/level-income",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      amount: loading ? "…" : formatInr(tradeTotal),
      count: tradeRows.length,
    },
    {
      title: "Sponsor income",
      desc: "Referral commissions",
      href: "/userdashboard/income/sponser-income",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      amount: loading ? "…" : formatInr(sponsorTotal),
      count: sponsorRows.length,
    },
    {
      title: "Matching income",
      desc: "Binary matching payouts",
      href: "/userdashboard/income/matching-income",
      icon: Layers,
      color: "from-purple-500 to-pink-500",
      amount: loading ? "…" : formatInr(matchingTotal),
      count: matchingRows.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Income Report
          </h2>
          <p className="text-slate-400 text-sm mt-1">Live income metrics from trade, sponsor and matching streams.</p>
          {error && <p className="text-sm text-amber-400 mt-2">{error}</p>}
        </div>

        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          <p className="text-sm text-slate-300">Total Income (Trade + Sponsor + Matching)</p>
          <h1 className="text-3xl font-bold mt-1 text-white">
            {loading ? "…" : formatInr(total)}
          </h1>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-indigo-100/90">
            <span className="inline-flex items-center gap-1"><ArrowUpRight size={12} /> Entries: {tradeRows.length + sponsorRows.length + matchingRows.length}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> Latest: {latestDate ? new Date(latestDate).toLocaleString() : "-"}</span>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Trade Entries</p>
            <p className="text-xl font-semibold mt-1">{tradeRows.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Sponsor Entries</p>
            <p className="text-xl font-semibold mt-1">{sponsorRows.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Matching Entries</p>
            <p className="text-xl font-semibold mt-1">{matchingRows.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {incomeCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={i} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${item.color} shadow-xl cursor-pointer overflow-hidden border border-white/10`}
                >
                  <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20" />
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/20 mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-xs text-white/80">{item.desc}</p>
                  <p className="mt-4 text-xl font-bold text-white">{item.amount}</p>
                  <p className="text-[11px] text-white/80 mt-1">{item.count} entries</p>
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/5" />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
