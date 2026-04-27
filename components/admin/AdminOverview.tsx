"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAdminOverview, type AdminOverviewDto } from "@/lib/api";

const CARD_CLASS = "rounded-xl border border-white/10 bg-white/[0.03] p-4";

export default function AdminOverview() {
  const [data, setData] = useState<AdminOverviewDto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAdminOverview(14);
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin overview.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-slate-400 text-sm">Loading overview…</p>;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!data) return <p className="text-slate-500 text-sm">No data available.</p>;

  const t = data.totals;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Total users</p><p className="text-xl text-white font-semibold">{t.totalUsers}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Active users</p><p className="text-xl text-white font-semibold">{t.activeUsers}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Pending funds</p><p className="text-xl text-white font-semibold">{t.pendingFundRequests}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Pending withdrawals</p><p className="text-xl text-white font-semibold">{t.pendingWithdrawals}</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Active plans configured</p><p className="text-xl text-white font-semibold">{t.totalPlans}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500">Packages configured</p><p className="text-xl text-white font-semibold">{t.totalPackages}</p></div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 h-[330px]">
        <p className="text-sm text-white font-medium mb-3">14-day flow trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
            <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="approvedFundsIn" stroke="#34d399" fill="#34d39933" />
            <Area type="monotone" dataKey="approvedWithdrawalsOut" stroke="#f59e0b" fill="#f59e0b33" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
