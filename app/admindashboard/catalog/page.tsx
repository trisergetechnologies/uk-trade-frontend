"use client";

import { useEffect, useState } from "react";
import {
  getAdminPackageProducts,
  getAdminPlans,
  postAdminPackageProduct,
  postAdminPlan,
  type AdminPackageProductRow,
  type AdminPlanRow,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

export default function AdminCatalogPage() {
  const [plans, setPlans] = useState<AdminPlanRow[]>([]);
  const [packages, setPackages] = useState<AdminPackageProductRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [pkgSubmitting, setPkgSubmitting] = useState(false);
  const [planForm, setPlanForm] = useState({
    code: "",
    name: "",
    dailyPercent: "1",
    cycleDaysW: "5",
    maxWorkingDaysN: "25",
    sponsorPercent: "5",
    summary: "",
    detailHelp: "",
  });
  const [pkgForm, setPkgForm] = useState({
    code: "",
    name: "",
    amount: "",
    shortDescription: "",
    detailHelp: "",
    featuresText: "",
    sortOrder: "0",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [plansRes, packagesRes] = await Promise.all([getAdminPlans(), getAdminPackageProducts()]);
      setPlans(plansRes.data || []);
      setPackages(packagesRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans/packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Plans & Packages</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure what users can purchase. These settings directly affect daily trade credits, sponsor income, and payout timing.
        </p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          <div>
            <h2 className="text-lg font-medium text-white">Create Plan</h2>
            <p className="text-xs text-slate-500">Business impact: defines earning speed, cycle pattern, and total working days.</p>
          </div>
          <div className="grid gap-3">
            <input placeholder="Code (e.g. A)" value={planForm.code} onChange={(e) => setPlanForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <input placeholder="Name (e.g. Starter Plan)" value={planForm.name} onChange={(e) => setPlanForm((s) => ({ ...s, name: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Daily % (e.g. 1)" value={planForm.dailyPercent} onChange={(e) => setPlanForm((s) => ({ ...s, dailyPercent: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <input placeholder="Cycle days W (e.g. 5)" value={planForm.cycleDaysW} onChange={(e) => setPlanForm((s) => ({ ...s, cycleDaysW: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Max working days N (e.g. 25)" value={planForm.maxWorkingDaysN} onChange={(e) => setPlanForm((s) => ({ ...s, maxWorkingDaysN: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <input placeholder="Sponsor % (default 5)" value={planForm.sponsorPercent} onChange={(e) => setPlanForm((s) => ({ ...s, sponsorPercent: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <textarea rows={2} placeholder="Short admin explanation shown to users (summary)" value={planForm.summary} onChange={(e) => setPlanForm((s) => ({ ...s, summary: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <textarea rows={4} placeholder="Detailed agreement/help text (what this means, risks, payout behavior)" value={planForm.detailHelp} onChange={(e) => setPlanForm((s) => ({ ...s, detailHelp: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <button
            disabled={planSubmitting}
            onClick={async () => {
              setPlanSubmitting(true);
              setError("");
              try {
                await postAdminPlan({
                  code: planForm.code.trim().toUpperCase(),
                  name: planForm.name.trim(),
                  dailyPercent: Number(planForm.dailyPercent),
                  cycleDaysW: Number(planForm.cycleDaysW),
                  maxWorkingDaysN: Number(planForm.maxWorkingDaysN),
                  sponsorPercent: Number(planForm.sponsorPercent),
                  summary: planForm.summary.trim(),
                  detailHelp: planForm.detailHelp.trim(),
                  isActive: true,
                });
                setPlanForm({ code: "", name: "", dailyPercent: "1", cycleDaysW: "5", maxWorkingDaysN: "25", sponsorPercent: "5", summary: "", detailHelp: "" });
                await load();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create plan.");
              } finally {
                setPlanSubmitting(false);
              }
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {planSubmitting ? "Creating..." : "Create plan"}
          </button>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          <div>
            <h2 className="text-lg font-medium text-white">Create Package</h2>
            <p className="text-xs text-slate-500">Business impact: package amount is principal used by trade-credit business logic.</p>
          </div>
          <div className="grid gap-3">
            <input placeholder="Code (e.g. P01)" value={pkgForm.code} onChange={(e) => setPkgForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <input placeholder="Name (e.g. Bronze Package)" value={pkgForm.name} onChange={(e) => setPkgForm((s) => ({ ...s, name: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Amount (INR)" value={pkgForm.amount} onChange={(e) => setPkgForm((s) => ({ ...s, amount: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <input placeholder="Sort order (0,1,2...)" value={pkgForm.sortOrder} onChange={(e) => setPkgForm((s) => ({ ...s, sortOrder: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <textarea rows={2} placeholder="Short description (card text)" value={pkgForm.shortDescription} onChange={(e) => setPkgForm((s) => ({ ...s, shortDescription: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <textarea rows={4} placeholder="Agreement/details tooltip text" value={pkgForm.detailHelp} onChange={(e) => setPkgForm((s) => ({ ...s, detailHelp: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            <textarea rows={3} placeholder="Features (one per line)" value={pkgForm.featuresText} onChange={(e) => setPkgForm((s) => ({ ...s, featuresText: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <button
            disabled={pkgSubmitting}
            onClick={async () => {
              setPkgSubmitting(true);
              setError("");
              try {
                await postAdminPackageProduct({
                  code: pkgForm.code.trim().toUpperCase(),
                  name: pkgForm.name.trim(),
                  amount: Number(pkgForm.amount),
                  shortDescription: pkgForm.shortDescription.trim(),
                  detailHelp: pkgForm.detailHelp.trim(),
                  features: pkgForm.featuresText.split("\n").map((x) => x.trim()).filter(Boolean),
                  sortOrder: Number(pkgForm.sortOrder),
                  isActive: true,
                });
                setPkgForm({ code: "", name: "", amount: "", shortDescription: "", detailHelp: "", featuresText: "", sortOrder: "0" });
                await load();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create package.");
              } finally {
                setPkgSubmitting(false);
              }
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {pkgSubmitting ? "Creating..." : "Create package"}
          </button>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white font-medium mb-3">Existing Plans</h3>
          {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
            <div className="space-y-2">
              {plans.map((p) => (
                <div key={p.id} className="rounded border border-white/10 p-3 text-sm">
                  <p className="text-white">{p.code} · {p.name}</p>
                  <p className="text-slate-400 text-xs">Daily {p.dailyPercent}% · W={p.cycleDaysW} · N={p.maxWorkingDaysN}</p>
                </div>
              ))}
              {!plans.length && <p className="text-slate-500 text-sm">No plans configured.</p>}
            </div>
          )}
        </section>
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white font-medium mb-3">Existing Packages</h3>
          {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
            <div className="space-y-2">
              {packages.map((p) => (
                <div key={p.id} className="rounded border border-white/10 p-3 text-sm">
                  <p className="text-white">{p.code} · {p.name}</p>
                  <p className="text-slate-400 text-xs">{formatInr(p.amount)}</p>
                </div>
              ))}
              {!packages.length && <p className="text-slate-500 text-sm">No packages configured.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
