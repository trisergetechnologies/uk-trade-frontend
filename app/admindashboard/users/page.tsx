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
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmRow, setConfirmRow] = useState<AdminUserRow | null>(null);
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const isActive = status === "" ? undefined : status === "active";
      const res = await getAdminUsers({ page, limit: PAGE_SIZE, q, isActive });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, q, status]);

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
          <p className="text-sm text-slate-400">Search, review, and control user account status.</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Deactivate means user cannot login and cannot perform new actions; historical data remains intact.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search name, email, user code"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as "" | "active" | "inactive");
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[760px] text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-500 border-b border-white/10">
            <tr><th className="px-4 py-3 text-left">User</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-4 py-6 text-slate-500" colSpan={5}>Loading…</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="px-4 py-3">
                  <p className="text-white">{row.name || "—"}</p>
                  <p className="text-xs text-slate-500">{row.userCode || row.id}</p>
                </td>
                <td className="px-4 py-3">{row.email || "—"}</td>
                <td className="px-4 py-3 capitalize">{row.role || "—"}</td>
                <td className="px-4 py-3">{row.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
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
        <div className="flex items-center justify-between text-sm text-slate-400">
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
