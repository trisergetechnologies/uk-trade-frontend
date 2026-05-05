"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getAdminUserDetail,
  getAdminUserPassword,
  postAdminCreditUser,
  postAdminPurchaseForUser,
  getAdminPlans,
  getAdminPackageProducts,
  type AdminPackageProductRow,
  type AdminPlanRow,
  type AdminUserDetailDto,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

type Tab = "overview" | "credit" | "purchase" | "password";

export default function AdminUserDetailPage() {
  const params = useParams<{ userCode: string }>();
  const userCode = decodeURIComponent(String(params?.userCode || "")).toUpperCase();
  const [data, setData] = useState<AdminUserDetailDto | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditMsg, setCreditMsg] = useState<{ ok?: string; err?: string }>({});
  const [creditBusy, setCreditBusy] = useState(false);

  const [plans, setPlans] = useState<AdminPlanRow[]>([]);
  const [packages, setPackages] = useState<AdminPackageProductRow[]>([]);
  const [planCode, setPlanCode] = useState("");
  const [packageCode, setPackageCode] = useState("");
  const [purchaseMsg, setPurchaseMsg] = useState<{ ok?: string; err?: string }>({});
  const [purchaseBusy, setPurchaseBusy] = useState(false);

  const [passwordShown, setPasswordShown] = useState<string | null>(null);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordErr, setPasswordErr] = useState("");

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

  useEffect(() => {
    if (tab !== "purchase") return;
    (async () => {
      try {
        const [pr, pk] = await Promise.all([getAdminPlans(), getAdminPackageProducts()]);
        const activePlans = (pr.data || []).filter((p) => p.isActive !== false);
        const activePk = (pk.data || []).filter((p) => p.isActive !== false);
        setPlans(activePlans);
        setPackages(activePk);
        setPlanCode((prev) => prev || activePlans[0]?.code || "");
        setPackageCode((prev) => prev || activePk[0]?.code || "");
      } catch {
        /* ignore */
      }
    })();
  }, [tab]);

  async function submitCredit(e: React.FormEvent) {
    e.preventDefault();
    setCreditMsg({});
    const amt = Number(creditAmount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    try {
      setCreditBusy(true);
      await postAdminCreditUser(userCode, { amount: amt, note: creditNote.trim() || undefined });
      setCreditMsg({ ok: "Credit applied." });
      setCreditAmount("");
      setCreditNote("");
      const res = await getAdminUserDetail(userCode);
      setData(res.data);
    } catch (err) {
      setCreditMsg({ err: err instanceof Error ? err.message : "Failed" });
    } finally {
      setCreditBusy(false);
    }
  }

  async function submitPurchase(e: React.FormEvent) {
    e.preventDefault();
    setPurchaseMsg({});
    if (!planCode || !packageCode) return;
    try {
      setPurchaseBusy(true);
      await postAdminPurchaseForUser(userCode, { planCode, packageCode });
      setPurchaseMsg({ ok: "Package purchased on behalf of user (wallet debited)." });
      const res = await getAdminUserDetail(userCode);
      setData(res.data);
    } catch (err) {
      setPurchaseMsg({ err: err instanceof Error ? err.message : "Purchase failed" });
    } finally {
      setPurchaseBusy(false);
    }
  }

  async function revealPassword() {
    setPasswordErr("");
    try {
      setPasswordBusy(true);
      const res = await getAdminUserPassword(userCode);
      const p = res.data?.password;
      setPasswordShown(p ?? "");
    } catch (err) {
      setPasswordErr(err instanceof Error ? err.message : "Failed");
    } finally {
      setPasswordBusy(false);
    }
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!data) return <p className="text-sm text-slate-400">Loading user profile…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admindashboard/users" className="text-xs text-slate-500 hover:text-slate-300">
            ← Users
          </Link>
          <h1 className="text-2xl text-white font-semibold mt-1">{data.user.name}</h1>
          <p className="text-slate-400 text-sm">{data.user.email}</p>
          <p className="text-slate-500 text-xs mt-1">{userCode}</p>
        </div>
        <Link
          href={`/admindashboard/users/${encodeURIComponent(userCode)}/tree`}
          className="rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/25"
        >
          View team tree
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {(
          [
            ["overview", "Overview"],
            ["credit", "Credit funds"],
            ["purchase", "Buy package"],
            ["password", "Password"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              tab === id ? "bg-white/15 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <p className="text-slate-400 text-sm">Status: {data.user.isActive ? "Active" : "Inactive"}</p>
            <p className="text-slate-400 text-sm">Referral code: {data.user.referralCode}</p>
            <p className="text-slate-400 text-sm capitalize">Preferred community: {data.user.preferredCommunity}</p>
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
        </>
      )}

      {tab === "credit" && (
        <form onSubmit={submitCredit} className="max-w-md space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Credits wallet balance and eligible-to-withdraw by the same amount.</p>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Amount</label>
            <input
              type="number"
              min={1}
              step="0.01"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Note (optional)</label>
            <input
              value={creditNote}
              onChange={(e) => setCreditNote(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white"
            />
          </div>
          {creditMsg.ok && <p className="text-sm text-emerald-400">{creditMsg.ok}</p>}
          {creditMsg.err && <p className="text-sm text-red-400">{creditMsg.err}</p>}
          <button
            type="submit"
            disabled={creditBusy}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium"
          >
            {creditBusy ? "Applying…" : "Apply credit"}
          </button>
        </form>
      )}

      {tab === "purchase" && (
        <form onSubmit={submitPurchase} className="max-w-md space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">
            Debits this user&apos;s wallet (same as self-purchase). Ensure sufficient balance.
          </p>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Plan</label>
            <select
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white"
            >
              {plans.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Package</label>
            <select
              value={packageCode}
              onChange={(e) => setPackageCode(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white"
            >
              {packages.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} — {formatInr(p.amount)} ({p.code})
                </option>
              ))}
            </select>
          </div>
          {purchaseMsg.ok && <p className="text-sm text-emerald-400">{purchaseMsg.ok}</p>}
          {purchaseMsg.err && <p className="text-sm text-red-400">{purchaseMsg.err}</p>}
          <button
            type="submit"
            disabled={purchaseBusy || !plans.length || !packages.length}
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm font-medium"
          >
            {purchaseBusy ? "Purchasing…" : "Purchase on behalf"}
          </button>
        </form>
      )}

      {tab === "password" && (
        <div className="max-w-lg space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm text-amber-200/90">
            Stored encrypted at rest. Not available for accounts created before passwordCipher was enabled, until they
            change password again.
          </p>
          <button
            type="button"
            onClick={() => void revealPassword()}
            disabled={passwordBusy}
            className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
          >
            {passwordBusy ? "Loading…" : "Show password"}
          </button>
          {passwordErr && <p className="text-sm text-red-400">{passwordErr}</p>}
          {passwordShown !== null && (
            <div className="rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-sm text-white break-all">
              {passwordShown === "" ? (
                <span className="text-slate-400">Not available (no cipher on file).</span>
              ) : (
                passwordShown
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
