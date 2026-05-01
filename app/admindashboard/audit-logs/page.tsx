"use client";

import { useEffect, useState } from "react";
import { getAdminAuditLogs, type AdminAuditLogRow, type PaginatedMeta } from "@/lib/api";

export default function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AdminAuditLogRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAdminAuditLogs({ page, limit: 20 });
        setRows(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-white font-semibold">Audit logs</h1>
        <p className="text-sm text-slate-400">Trace who did what and when in admin actions.</p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[760px] text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3 text-left">When</th><th className="px-4 py-3 text-left">Action</th><th className="px-4 py-3 text-left">Actor</th><th className="px-4 py-3 text-left">Target</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-4 py-6 text-slate-500">Loading…</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="px-4 py-3">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-3">{row.action}</td>
                <td className="px-4 py-3">{row.actorUserId?.userCode || row.actorUserId?.name || "—"}</td>
                <td className="px-4 py-3">{row.targetType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>Page {meta.page} of {meta.totalPages} · {meta.total} logs</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-white/10 px-3 py-1 disabled:opacity-50">Prev</button>
            <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} className="rounded border border-white/10 px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
