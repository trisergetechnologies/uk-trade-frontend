"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  getPackageProducts,
  getPlans,
  getWalletMe,
  postPackagePurchase,
  type PackageProductRow,
  type PlanRow,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";
import { InfoTooltip } from "./InfoTooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Info, Loader2, Lock } from "lucide-react";

const HOW_FLOW =
  "Per BUSINESS-LOGIC: you add money via payment request, admin approves, then the balance sits in your one wallet. A purchase here does not set a new amount — you choose a fixed package (principal slot) and a plan (A–D) that sets daily %, W (withdrawal cycle length in IST calendar days), and N (max working days of trade income). " +
  "The wallet is debited by the package price. Trade income runs on working days; sponsor pays on referred purchases when the referrer has an active package. Principal is not returned in a lump sum.";

export default function PackagePurchaseFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [products, setProducts] = useState<PackageProductRow[]>([]);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [product, setProduct] = useState<PackageProductRow | null>(null);
  const [plan, setPlan] = useState<PlanRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const packageNextRef = useRef<HTMLDivElement | null>(null);
  const planNextRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [pRes, wRes, plRes] = await Promise.all([
        getPackageProducts(),
        getWalletMe(),
        getPlans(),
      ]);
      setProducts(pRes.data || []);
      setBalance(wRes.data?.balance ?? 0);
      setPlans(plRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (step !== 1 || !product) return;
    packageNextRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [product, step]);

  useEffect(() => {
    if (step !== 2 || !plan) return;
    planNextRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [plan, step]);

  async function onConfirmPurchase() {
    if (!product || !plan) return;
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await postPackagePurchase({ planCode: plan.code, packageCode: product.code });
      setSuccessMsg("Purchase complete. You can see subscriptions under the dashboard and wallet ledger for the debit.");
      setStep(1);
      setProduct(null);
      setPlan(null);
      await load();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Purchase failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Loader2 className="animate-spin w-4 h-4" />
        Loading package catalog and plans…
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <p className="text-sm text-amber-300/90">
        {error}{" "}
        <button type="button" className="underline" onClick={() => void load()}>
          Retry
        </button>
      </p>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {successMsg && (
        <div className="flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && products.length > 0 && (
        <p className="text-sm text-amber-300/90">{error}</p>
      )}

      <div className="rounded-3xl border border-white/10 bg-[#0a0f1a]/80 p-5 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              How this flow works
              <InfoTooltip label="Explain package, plan, and wallet rules">{HOW_FLOW}</InfoTooltip>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Step through: <span className="text-slate-300">Package (fixed price)</span> →{" "}
              <span className="text-slate-300">Plan (A–D, rules)</span> → <span className="text-slate-300">Checkout (wallet debit)</span>.
            </p>
          </div>
          <div className="text-sm text-slate-300 shrink-0">
            Wallet:{" "}
            <span className="text-white font-semibold tabular-nums">
              {balance !== null ? formatInr(balance) : "—"}
            </span>
            <Link
              href="/userdashboard/add-fund"
              className="ml-2 text-indigo-400 hover:underline"
            >
              Add fund
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className="flex items-center gap-2">
            {n > 1 && <span className="text-slate-600">→</span>}
            <span
              className={step === n ? "text-indigo-400 font-medium" : "text-slate-500"}
            >{`Step ${n}`}</span>
            <span className="text-slate-600">—</span>
            <span>
              {n === 1 ? "Package" : n === 2 ? "Plan" : "Checkout"}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">1. Choose a package (fixed amount)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const selected = product?.id === p.id;
              const canAfford = balance !== null && p.amount <= balance;
              return (
                <Fragment key={p.id}>
                  <div
                    className={`
                    relative rounded-2xl border p-4 text-left transition
                    ${selected ? "border-indigo-500/60 ring-1 ring-indigo-500/30 bg-indigo-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}
                  `}
                  >
                    <div className="absolute top-3 right-3">
                      <InfoTooltip label={`Details: ${p.name}`}>{p.detailHelp || p.shortDescription || p.name}</InfoTooltip>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 pr-8">{p.code}</p>
                    <p className="text-lg font-bold text-white mt-1">{formatInr(p.amount)}</p>
                    <p className="text-sm text-slate-300 font-medium mt-0.5">{p.name}</p>
                    {p.shortDescription && (
                      <p className="text-xs text-slate-500 mt-1">{p.shortDescription}</p>
                    )}
                    {p.features && p.features.length > 0 && (
                      <ul className="mt-3 text-xs text-slate-400 space-y-1 list-disc list-inside">
                        {p.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                    {!canAfford && (
                      <p className="mt-2 text-xs text-amber-400/90 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Add funds to reach this amount
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setProduct(p);
                      }}
                      disabled={!canAfford}
                      className={`
                      mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-40"
                      }
                    `}
                    >
                      {selected ? "Selected" : "Select"}
                    </button>
                  </div>
                  {selected && (
                    <div ref={packageNextRef} className="col-span-full">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-900/30"
                      >
                        Next: pick a plan
                      </button>
                      <p className="text-xs text-slate-500 mt-2">Continue to choose plan A–D for this package.</p>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-lg font-semibold text-white mb-1">2. Choose a plan (A–D)</h2>
          <p className="text-sm text-slate-500 mb-4 max-w-2xl">
            Daily trade income = principal × (plan daily %). <strong className="text-slate-400">W</strong> (days) = withdrawal
            cycle length; <strong className="text-slate-400">N</strong> = working days of income before the subscription completes.
            Tap <Info className="w-3 h-3 inline" /> on each plan for the full blurb.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((pl) => {
              const selected = plan?.id === pl.id;
              return (
                <Fragment key={pl.id}>
                  <div
                    className={`
                    relative rounded-2xl border p-4
                    ${selected ? "border-indigo-500/60 ring-1 ring-indigo-500/30 bg-indigo-500/10" : "border-white/10 bg-white/[0.03]"}
                  `}
                  >
                    <div className="absolute top-3 right-3">
                      <InfoTooltip label={`Details: Plan ${pl.code}`}>
                        {pl.detailHelp || `${pl.name}. Daily % ${pl.dailyPercent}, W = ${pl.cycleDaysW} days, N = ${pl.maxWorkingDaysN} working days.`}
                      </InfoTooltip>
                    </div>
                    <p className="pr-8">
                      <span className="text-2xl font-bold text-white">{pl.code}</span>{" "}
                      <span className="text-slate-300 text-sm">{pl.name.replace(/^Plan [A-D] — /, "")}</span>
                    </p>
                    {pl.summary && <p className="text-xs text-slate-500 mt-2">{pl.summary}</p>}
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div>
                        <dt className="text-slate-500">Daily %</dt>
                        <dd className="text-slate-200 font-medium tabular-nums">{pl.dailyPercent}%</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">W (cycle days)</dt>
                        <dd className="text-slate-200 font-medium">{pl.cycleDaysW}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">N (income days)</dt>
                        <dd className="text-slate-200 font-medium">{pl.maxWorkingDaysN}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Sponsor %</dt>
                        <dd className="text-slate-200 font-medium">{pl.sponsorPercent ?? 0}%</dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => setPlan(pl)}
                      className={`
                      mt-4 w-full py-2.5 rounded-xl text-sm font-medium
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "bg-white/5 text-slate-200 hover:bg-white/10"
                      }
                    `}
                    >
                      {selected ? "Selected" : "Select plan"}
                    </button>
                  </div>
                  {selected && (
                    <div ref={planNextRef} className="col-span-full">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-900/30"
                      >
                        Next: review &amp; pay
                      </button>
                      <p className="text-xs text-slate-500 mt-2">Review package + plan and confirm wallet debit.</p>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      )}

      {step === 3 && product && plan && (
        <section>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-lg font-semibold text-white mb-4">3. Checkout</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 max-w-md space-y-3 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Package</span>{" "}
              <span className="text-white">
                {product.name} ({product.code})
              </span>
            </p>
            <p>
              <span className="text-slate-500">You pay</span>{" "}
              <span className="text-white text-lg font-bold tabular-nums">{formatInr(product.amount)}</span>
            </p>
            <p>
              <span className="text-slate-500">Plan</span>{" "}
              <span className="text-white">
                {plan.code} — {plan.dailyPercent}% / W {plan.cycleDaysW} / N {plan.maxWorkingDaysN}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Wallet after</span>{" "}
              <span className="text-slate-200">
                {balance !== null
                  ? formatInr(Math.max(0, balance - product.amount))
                  : "—"}{" "}
                (if this purchase succeeds)
              </span>
            </p>
          </div>
          {balance !== null && product.amount > balance && (
            <p className="mt-3 text-sm text-amber-300/90">
              Insufficient balance. <Link className="underline" href="/userdashboard/add-fund">Add fund</Link> first.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void onConfirmPurchase()}
              disabled={submitting || balance === null || product.amount > balance}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-40"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Processing…" : "Confirm & debit wallet"}
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
