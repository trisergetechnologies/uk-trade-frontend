"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, KeyRound } from "lucide-react";
import {
  getAdminUserPasswordsList,
  type AdminUserPasswordRow,
  type PaginatedMeta,
} from "@/lib/api";

const PAGE_SIZE = 25;

export default function AdminUserPasswordsPage() {
  const [rows, setRows] = useState<AdminUserPasswordRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminUserPasswordsList({ page, limit: PAGE_SIZE, q });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyPassword(text: string, userCode: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(userCode);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-3">
        <KeyRound className="text-amber-400 shrink-0 mt-1" size={26} />
        <div>
          <h1 className="text-2xl font-semibold text-white">User passwords</h1>
          <p className="text-sm text-slate-400 mt-1">View and copy member passwords when needed for support.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search by name or email"
          className="w-full sm:w-72 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[920px] text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-500 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Password</th>
              <th className="px-4 py-3 text-left"> </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.userCode} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    <p className="text-white">{row.name}</p>
                  </td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3 capitalize">{row.role}</td>
                  <td className="px-4 py-3 font-mono text-xs max-w-[280px] break-all">
                    {row.password ? (
                      <span className="text-emerald-200/90">{row.password}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.password && (
                        <button
                          type="button"
                          onClick={() => void copyPassword(row.password!, row.userCode)}
                          className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
                        >
                          <Copy size={12} />
                          {copiedCode === row.userCode ? "Copied" : "Copy"}
                        </button>
                      )}
                      <Link
                        href={`/admindashboard/users/${encodeURIComponent(row.userCode)}`}
                        className="text-xs text-indigo-300 hover:underline"
                      >
                        Profile
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-slate-500">
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>
            Page {meta.page} of {meta.totalPages} · {meta.total} users
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-white/10 px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="rounded border border-white/10 px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
