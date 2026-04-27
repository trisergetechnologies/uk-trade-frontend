"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
    await patchAdminUserStatus(row.userCode || row.id, !row.isActive);
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-sm text-slate-400">Search, review, and control user account status.</p>
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
                    <button onClick={() => void toggleUser(row)} className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10">
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
    </div>
  );
}
