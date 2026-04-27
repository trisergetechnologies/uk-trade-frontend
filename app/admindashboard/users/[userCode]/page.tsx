"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAdminUserDetail, type AdminUserDetailDto } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function AdminUserDetailPage() {
  const params = useParams<{ userCode: string }>();
  const userCode = String(params?.userCode || "");
  const [data, setData] = useState<AdminUserDetailDto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userCode) return;
    (async () => {
      try {
        const res = await getAdminUserDetail(userCode);
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user.");
      }
    })();
  }, [userCode]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!data) return <p className="text-sm text-slate-400">Loading user profile…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-white font-semibold">User detail</h1>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
        <p className="text-white">{data.user.name}</p>
        <p className="text-slate-400 text-sm">{data.user.email}</p>
        <p className="text-slate-500 text-xs">{userCode}</p>
        <p className="text-slate-400 text-sm">Status: {data.user.isActive ? "Active" : "Inactive"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-slate-500">Wallet balance</p>
          <p className="text-xl text-white font-semibold">{formatInr(data.wallet?.balance || 0)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-slate-500">Eligible amount</p>
          <p className="text-xl text-white font-semibold">{formatInr(data.wallet?.eligibleToWithdraw || 0)}</p>
        </div>
      </div>
    </div>
  );
}
