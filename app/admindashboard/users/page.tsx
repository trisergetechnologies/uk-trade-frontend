"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, UserX, Users2, X } from "lucide-react";
import { getAdminUsers, patchAdminUserStatus, type AdminUserRow, type PaginatedMeta } from "@/lib/api";

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [accountStatus, setAccountStatus] = useState<"" | "active" | "inactive">("");
  const [packageFilter, setPackageFilter] = useState<"" | "purchased" | "none">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmRow, setConfirmRow] = useState<AdminUserRow | null>(null);
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const isActive = accountStatus === "" ? undefined : accountStatus === "active";
      const hasPurchasedPackage =
        packageFilter === "" ? undefined : packageFilter === "purchased" ? true : false;
      const res = await getAdminUsers({ page, limit: PAGE_SIZE, q, isActive, hasPurchasedPackage });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, q, accountStatus, packageFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleUser = async (row: AdminUserRow) => {
    setConfirmSubmitting(true);
    try {
      await patchAdminUserStatus(row.userCode || row.id, !row.isActive);
      await load();
      setConfirmRow(null);
    } finally {
      setConfirmSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2"><Users2 size={22} />Users</h1>
          <p className="text-sm text-slate-400">
            Search users, see who has bought packages and which plans are still active, and control login access.
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Deactivate means user cannot login and cannot perform new actions; historical data remains intact.
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2 flex-wrap">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search name, email, user code"
            className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
          <select
            value={accountStatus}
            onChange={(e) => {
              setPage(1);
              setAccountStatus(e.target.value as "" | "active" | "inactive");
            }}
            className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            title="Whether the user account can log in"
          >
            <option value="">Account: all</option>
            <option value="active">Account: can log in</option>
            <option value="inactive">Account: blocked</option>
          </select>
          <select
            value={packageFilter}
            onChange={(e) => {
              setPage(1);
              setPackageFilter(e.target.value as "" | "purchased" | "none");
            }}
            className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            title="Filter by whether the user has ever purchased a package"
          >
            <option value="">Packages: all</option>
            <option value="purchased">Packages: bought at least one</option>
            <option value="none">Packages: never bought</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[960px] text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
          <thead className="text-xs uppercase text-slate-500 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-left">Purchases</th>
              <th className="px-4 py-3 text-left min-w-[200px]">Active packages</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-4 py-6 text-slate-500" colSpan={7}>Loading…</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="px-4 py-3">
                  <p className="text-white">{row.name || "—"}</p>
                  <p className="text-xs text-slate-500">{row.userCode || row.id}</p>
                </td>
                <td className="px-4 py-3">{row.email || "—"}</td>
                <td className="px-4 py-3 capitalize">{row.role || "—"}</td>
                <td className="px-4 py-3">{row.isActive ? "Can log in" : "Blocked"}</td>
                <td className="px-4 py-3">
                  {row.hasPurchasedPackage ? (
                    <span className="text-emerald-300/90">Purchased</span>
                  ) : (
                    <span className="text-slate-500">No package yet</span>
                  )}
                </td>
                <td className="px-4 py-3 align-top whitespace-normal">
                  {row.activePackages && row.activePackages.length > 0 ? (
                    <ul className="space-y-1 text-xs">
                      {row.activePackages.map((p) => (
                        <li key={p.publicId || `${p.planCode}-${p.amount}`} className="text-slate-200">
                          <span className="text-white font-medium">{p.planCode || p.planName || "Plan"}</span>
                          {p.planName && p.planCode ? <span className="text-slate-500"> · {p.planName}</span> : null}
                          <span className="text-slate-400">
                            {" "}
                            — {Number(p.amount).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : row.hasPurchasedPackage ? (
                    <span className="text-xs text-slate-500">No active subscription (completed or none running)</span>
                  ) : (
                    <span className="text-xs text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <Link href={`/admindashboard/users/${encodeURIComponent(row.userCode || row.id)}`} className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10">View</Link>
                    <button onClick={() => setConfirmRow(row)} className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10">
                      {row.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>Page {meta.page} of {meta.totalPages} · {meta.total} users</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-white/10 px-3 py-1 disabled:opacity-50">Prev</button>
            <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} className="rounded border border-white/10 px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
      {confirmRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b0f1a] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                {confirmRow.isActive ? <UserX size={18} className="text-amber-300" /> : <ShieldCheck size={18} className="text-emerald-300" />}
                Confirm {confirmRow.isActive ? "deactivate" : "activate"}
              </h3>
              <button onClick={() => setConfirmRow(null)} className="rounded p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-300">
              {confirmRow.isActive
                ? `This will block ${confirmRow.name || confirmRow.userCode || "this user"} from login and new platform actions.`
                : `This will restore access for ${confirmRow.name || confirmRow.userCode || "this user"}.`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmRow(null)} className="rounded border border-white/10 px-3 py-2 text-sm">Cancel</button>
              <button
                disabled={confirmSubmitting}
                onClick={() => void toggleUser(confirmRow)}
                className={`rounded px-3 py-2 text-sm text-white disabled:opacity-50 ${confirmRow.isActive ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
              >
                {confirmSubmitting ? "Saving..." : confirmRow.isActive ? "Confirm deactivate" : "Confirm activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
