"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Loader2, Package } from "lucide-react";
import { getMyPackages, type PackageRow } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

function planFromRow(row: PackageRow) {
  const p = row.planId;
  if (p && typeof p === "object" && "name" in p) return p;
  return null;
}

function rowKey(row: PackageRow, index: number) {
  const r = row as PackageRow & { _id?: string; publicId?: string };
  return r.publicId || r.id || r._id || String(index);
}

export default function MyActivePackages() {
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getMyPackages();
      setRows(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-12">
        <Loader2 className="animate-spin" size={18} />
        Loading your packages…
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-amber-400 py-6">{error}</p>;
  }

  const active = rows.filter((r) => r.status === "active");
  const completed = rows.filter((r) => r.status === "completed");

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-indigo-400" size={22} />
          <h2 className="text-lg font-semibold text-white">Active packages</h2>
        </div>
        {active.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <Package className="mx-auto text-slate-500 mb-3" size={36} />
            <p className="text-slate-300 text-sm">You don&apos;t have an active package yet.</p>
            <Link
              href="/userdashboard/package"
              className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 underline"
            >
              Buy a package
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((row, i) => {
              const plan = planFromRow(row);
              return (
                <div
                  key={rowKey(row, i)}
                  className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-emerald-200/80">Active</p>
                      <p className="text-xl font-semibold text-white mt-1">
                        {plan?.name ?? "Plan"}
                        {plan?.code ? (
                          <span className="text-slate-400 font-normal text-base ml-2">({plan.code})</span>
                        ) : null}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/20 text-emerald-200 text-xs px-2.5 py-1 border border-emerald-500/30">
                      Running
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Principal</dt>
                      <dd className="text-white font-medium">{formatInr(row.principalAmount)}</dd>
                    </div>
                    {typeof plan?.dailyPercent === "number" && (
                      <div>
                        <dt className="text-slate-500">Daily return</dt>
                        <dd className="text-white font-medium">{plan.dailyPercent}%</dd>
                      </div>
                    )}
                    {typeof plan?.cycleDaysW === "number" && (
                      <div>
                        <dt className="text-slate-500">Cycle (days)</dt>
                        <dd className="text-white font-medium">{plan.cycleDaysW}</dd>
                      </div>
                    )}
                    {typeof plan?.maxWorkingDaysN === "number" && (
                      <div>
                        <dt className="text-slate-500">Max working days</dt>
                        <dd className="text-white font-medium">{plan.maxWorkingDaysN}</dd>
                      </div>
                    )}
                    {row.purchaseDateIst && (
                      <div>
                        <dt className="text-slate-500">Purchased (IST)</dt>
                        <dd className="text-slate-200">{row.purchaseDateIst}</dd>
                      </div>
                    )}
                    {typeof row.workingDaysCredited === "number" && (
                      <div>
                        <dt className="text-slate-500">Income days credited</dt>
                        <dd className="text-slate-200">{row.workingDaysCredited}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-slate-400 mb-3">Completed packages</h2>
          <ul className="space-y-2">
            {completed.map((row, i) => {
              const plan = planFromRow(row);
              return (
                <li
                  key={rowKey(row, i)}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <span className="text-slate-300">
                    {plan?.name ?? "Plan"} {plan?.code ? `(${plan.code})` : ""}
                  </span>
                  <span className="text-slate-500">{formatInr(row.principalAmount)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
