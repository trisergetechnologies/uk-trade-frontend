"use client";

import { useEffect, useState } from "react";
import { Users, WalletCards, BadgeIndianRupee, Clock3, Package, Layers3 } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><Users size={14} />Total users</p><p className="text-xl text-white font-semibold">{t.totalUsers}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><WalletCards size={14} />Active users</p><p className="text-xl text-white font-semibold">{t.activeUsers}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><Clock3 size={14} />Pending funds</p><p className="text-xl text-white font-semibold">{t.pendingFundRequests}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><BadgeIndianRupee size={14} />Pending withdrawals</p><p className="text-xl text-white font-semibold">{t.pendingWithdrawals}</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><Layers3 size={14} />Active plans configured</p><p className="text-xl text-white font-semibold">{t.totalPlans}</p></div>
        <div className={CARD_CLASS}><p className="text-xs text-slate-500 flex items-center gap-2"><Package size={14} />Packages configured</p><p className="text-xl text-white font-semibold">{t.totalPackages}</p></div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 h-[330px]">
        <p className="text-sm text-white font-medium mb-1">14-day operation trend</p>
        <p className="text-xs text-slate-500 mb-3">Shows purchased amount vs approved withdrawal amount (day-wise).</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
            <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="purchaseAmount" name="Purchases (amount)" stroke="#60a5fa" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="approvedWithdrawalsOut" name="Withdrawals (amount)" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
