"use client";

import { useEffect, useState } from "react";
import {
  getAdminPackageProducts,
  getAdminPlans,
  patchAdminPackageProduct,
  patchAdminPlan,
  postAdminPackageProduct,
  postAdminPlan,
  type AdminPackageProductRow,
  type AdminPlanRow,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const inputClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500";
const labelClass = "text-xs text-slate-500";

function PlanRowEditor({
  p,
  onClose,
  onSaved,
  onError,
}: {
  p: AdminPlanRow;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(p.name);
  const [dailyPercent, setDailyPercent] = useState(String(p.dailyPercent));
  const [cycleDaysW, setCycleDaysW] = useState(String(p.cycleDaysW));
  const [maxWorkingDaysN, setMaxWorkingDaysN] = useState(String(p.maxWorkingDaysN));
  const [sponsorPercent, setSponsorPercent] = useState(String(p.sponsorPercent ?? 5));
  const [summary, setSummary] = useState(p.summary ?? "");
  const [detailHelp, setDetailHelp] = useState(p.detailHelp ?? "");
  const [isActive, setIsActive] = useState(p.isActive !== false);

  const save = async () => {
    setSaving(true);
    onError("");
    try {
      await patchAdminPlan(p.code, {
        name: name.trim(),
        dailyPercent: Number(dailyPercent),
        cycleDaysW: Number(cycleDaysW),
        maxWorkingDaysN: Number(maxWorkingDaysN),
        sponsorPercent: Number(sponsorPercent),
        summary: summary.trim(),
        detailHelp: detailHelp.trim(),
        isActive,
      });
      onSaved();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
      <p className="text-xs text-amber-200/80">
        Changing daily %, W, or N affects all subscriptions that use this plan (live from the plan document).
      </p>
      <div className="grid gap-2">
        <label className={labelClass}>Name</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Daily %</label>
            <input className={inputClass} value={dailyPercent} onChange={(e) => setDailyPercent(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Cycle days W</label>
            <input className={inputClass} value={cycleDaysW} onChange={(e) => setCycleDaysW(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Max working days N</label>
            <input
              className={inputClass}
              value={maxWorkingDaysN}
              onChange={(e) => setMaxWorkingDaysN(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Sponsor %</label>
            <input
              className={inputClass}
              value={sponsorPercent}
              onChange={(e) => setSponsorPercent(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Summary (short)</label>
          <textarea rows={2} className={`${inputClass} w-full`} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Agreement / help (detail)</label>
          <textarea
            rows={4}
            className={`${inputClass} w-full`}
            value={detailHelp}
            onChange={(e) => setDetailHelp(e.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-white/20" />
          Active (shown to users for new purchases)
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={onClose} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
}

function PackageRowEditor({
  p,
  onClose,
  onSaved,
  onError,
}: {
  p: AdminPackageProductRow;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(p.name);
  const [amount, setAmount] = useState(String(p.amount));
  const [shortDescription, setShortDescription] = useState(p.shortDescription ?? "");
  const [detailHelp, setDetailHelp] = useState(p.detailHelp ?? "");
  const [featuresText, setFeaturesText] = useState((p.features ?? []).join("\n"));
  const [sortOrder, setSortOrder] = useState(String(p.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(p.isActive !== false);

  const save = async () => {
    setSaving(true);
    onError("");
    try {
      await patchAdminPackageProduct(p.code, {
        name: name.trim(),
        amount: Number(amount),
        shortDescription: shortDescription.trim(),
        detailHelp: detailHelp.trim(),
        features: featuresText.split("\n").map((x) => x.trim()).filter(Boolean),
        sortOrder: Number(sortOrder),
        isActive,
      });
      onSaved();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update package.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
      <div className="grid gap-2">
        <label className={labelClass}>Name</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Amount (INR)</label>
            <input className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Sort order</label>
            <input className={inputClass} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Short description</label>
          <textarea
            rows={2}
            className={`${inputClass} w-full`}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Agreement / details</label>
          <textarea rows={3} className={`${inputClass} w-full`} value={detailHelp} onChange={(e) => setDetailHelp(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Features (one per line)</label>
          <textarea rows={3} className={`${inputClass} w-full`} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-white/20" />
          Active (shown to users for new purchases)
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={onClose} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
}

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
  const [editingPlanCode, setEditingPlanCode] = useState<string | null>(null);
  const [editingPackageCode, setEditingPackageCode] = useState<string | null>(null);
  const [toggleBusy, setToggleBusy] = useState<string | null>(null);

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

  const togglePlanActive = async (p: AdminPlanRow) => {
    const next = p.isActive === false;
    setToggleBusy(`plan:${p.code}`);
    setError("");
    try {
      await patchAdminPlan(p.code, { isActive: next });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan.");
    } finally {
      setToggleBusy(null);
    }
  };

  const togglePkgActive = async (p: AdminPackageProductRow) => {
    const next = p.isActive === false;
    setToggleBusy(`pkg:${p.code}`);
    setError("");
    try {
      await patchAdminPackageProduct(p.code, { isActive: next });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update package.");
    } finally {
      setToggleBusy(null);
    }
  };

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
        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <h2 className="text-lg font-medium text-white">Create Plan</h2>
            <p className="text-xs text-slate-500">Business impact: defines earning speed, cycle pattern, and total working days.</p>
          </div>
          <div className="grid gap-3">
            <input
              placeholder="Code (e.g. A)"
              value={planForm.code}
              onChange={(e) => setPlanForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))}
              className={inputClass}
            />
            <input
              placeholder="Name (e.g. Starter Plan)"
              value={planForm.name}
              onChange={(e) => setPlanForm((s) => ({ ...s, name: e.target.value }))}
              className={inputClass}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Daily % (e.g. 1)"
                value={planForm.dailyPercent}
                onChange={(e) => setPlanForm((s) => ({ ...s, dailyPercent: e.target.value }))}
                className={inputClass}
              />
              <input
                placeholder="Cycle days W (e.g. 5)"
                value={planForm.cycleDaysW}
                onChange={(e) => setPlanForm((s) => ({ ...s, cycleDaysW: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Max working days N (e.g. 25)"
                value={planForm.maxWorkingDaysN}
                onChange={(e) => setPlanForm((s) => ({ ...s, maxWorkingDaysN: e.target.value }))}
                className={inputClass}
              />
              <input
                placeholder="Sponsor % (default 5)"
                value={planForm.sponsorPercent}
                onChange={(e) => setPlanForm((s) => ({ ...s, sponsorPercent: e.target.value }))}
                className={inputClass}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Short admin explanation shown to users (summary)"
              value={planForm.summary}
              onChange={(e) => setPlanForm((s) => ({ ...s, summary: e.target.value }))}
              className={inputClass}
            />
            <textarea
              rows={4}
              placeholder="Detailed agreement/help text (what this means, risks, payout behavior)"
              value={planForm.detailHelp}
              onChange={(e) => setPlanForm((s) => ({ ...s, detailHelp: e.target.value }))}
              className={inputClass}
            />
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
                setPlanForm({
                  code: "",
                  name: "",
                  dailyPercent: "1",
                  cycleDaysW: "5",
                  maxWorkingDaysN: "25",
                  sponsorPercent: "5",
                  summary: "",
                  detailHelp: "",
                });
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

        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <h2 className="text-lg font-medium text-white">Create Package</h2>
            <p className="text-xs text-slate-500">Business impact: package amount is principal used by trade-credit business logic.</p>
          </div>
          <div className="grid gap-3">
            <input
              placeholder="Code (e.g. P01)"
              value={pkgForm.code}
              onChange={(e) => setPkgForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))}
              className={inputClass}
            />
            <input
              placeholder="Name (e.g. Bronze Package)"
              value={pkgForm.name}
              onChange={(e) => setPkgForm((s) => ({ ...s, name: e.target.value }))}
              className={inputClass}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Amount (INR)"
                value={pkgForm.amount}
                onChange={(e) => setPkgForm((s) => ({ ...s, amount: e.target.value }))}
                className={inputClass}
              />
              <input
                placeholder="Sort order (0,1,2...)"
                value={pkgForm.sortOrder}
                onChange={(e) => setPkgForm((s) => ({ ...s, sortOrder: e.target.value }))}
                className={inputClass}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Short description (card text)"
              value={pkgForm.shortDescription}
              onChange={(e) => setPkgForm((s) => ({ ...s, shortDescription: e.target.value }))}
              className={inputClass}
            />
            <textarea
              rows={4}
              placeholder="Agreement/details tooltip text"
              value={pkgForm.detailHelp}
              onChange={(e) => setPkgForm((s) => ({ ...s, detailHelp: e.target.value }))}
              className={inputClass}
            />
            <textarea
              rows={3}
              placeholder="Features (one per line)"
              value={pkgForm.featuresText}
              onChange={(e) => setPkgForm((s) => ({ ...s, featuresText: e.target.value }))}
              className={inputClass}
            />
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
                setPkgForm({
                  code: "",
                  name: "",
                  amount: "",
                  shortDescription: "",
                  detailHelp: "",
                  featuresText: "",
                  sortOrder: "0",
                });
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
          <h3 className="mb-3 font-medium text-white">Existing Plans</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              {plans.map((p) => (
                <div key={p.id} className="rounded border border-white/10 p-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-white">
                        {p.code} · {p.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Daily {p.dailyPercent}% · W={p.cycleDaysW} · N={p.maxWorkingDaysN}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          p.isActive === false ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {p.isActive === false ? "Inactive" : "Active"}
                      </span>
                      <button
                        type="button"
                        disabled={toggleBusy === `plan:${p.code}`}
                        onClick={() => void togglePlanActive(p)}
                        className="rounded border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50"
                      >
                        {p.isActive === false ? "Activate" : "Deactivate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPlanCode((c) => (c === p.code ? null : p.code))}
                        className="rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                      >
                        {editingPlanCode === p.code ? "Close" : "Edit"}
                      </button>
                    </div>
                  </div>
                  {editingPlanCode === p.code && (
                    <PlanRowEditor
                      p={p}
                      onClose={() => setEditingPlanCode(null)}
                      onSaved={() => void load()}
                      onError={setError}
                    />
                  )}
                </div>
              ))}
              {!plans.length && <p className="text-sm text-slate-500">No plans configured.</p>}
            </div>
          )}
        </section>
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 font-medium text-white">Existing Packages</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              {packages.map((p) => (
                <div key={p.id} className="rounded border border-white/10 p-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-white">
                        {p.code} · {p.name}
                      </p>
                      <p className="text-xs text-slate-400">{formatInr(p.amount)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          p.isActive === false ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {p.isActive === false ? "Inactive" : "Active"}
                      </span>
                      <button
                        type="button"
                        disabled={toggleBusy === `pkg:${p.code}`}
                        onClick={() => void togglePkgActive(p)}
                        className="rounded border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50"
                      >
                        {p.isActive === false ? "Activate" : "Deactivate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPackageCode((c) => (c === p.code ? null : p.code))}
                        className="rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                      >
                        {editingPackageCode === p.code ? "Close" : "Edit"}
                      </button>
                    </div>
                  </div>
                  {editingPackageCode === p.code && (
                    <PackageRowEditor
                      p={p}
                      onClose={() => setEditingPackageCode(null)}
                      onSaved={() => void load()}
                      onError={setError}
                    />
                  )}
                </div>
              ))}
              {!packages.length && <p className="text-sm text-slate-500">No packages configured.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
