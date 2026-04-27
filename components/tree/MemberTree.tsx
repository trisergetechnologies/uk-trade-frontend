"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getNetworkTree, type TreeApiResponse } from "@/lib/api";
import type { PaginatedMeta } from "@/lib/api";

const PAGE_SIZE = 30;

export default function MemberTree() {
  const [data, setData] = useState<TreeApiResponse | null>(null);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await getNetworkTree(page, PAGE_SIZE);
      setData(res.data);
      setMeta(res.data.meta || null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tree");
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 overflow-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-400">Network tree</h1>
        <p className="text-gray-400 text-sm">Your node and downline (paginated).</p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          {error}
        </div>
      )}

      {!error && !data && (
        <div className="max-w-3xl mx-auto h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
      )}

      {data && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#050816] p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Your node</h2>
            {data.myNode ? (
              <dl className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <dt>Community</dt>
                <dd className="text-white">{data.myNode.community ?? "—"}</dd>
                <dt>Side</dt>
                <dd className="text-white">{data.myNode.side ?? "—"}</dd>
                <dt>Level</dt>
                <dd className="text-white">{data.myNode.level ?? "—"}</dd>
                <dt>Parent user</dt>
                <dd className="text-white font-mono text-xs break-all">
                  {data.myNode.parentUserId ? String(data.myNode.parentUserId) : "—"}
                </dd>
              </dl>
            ) : (
              <p className="text-slate-400 text-sm">No tree node yet.</p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050816] p-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-white">Downline</h2>
              {meta && meta.total > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border border-white/10 p-1 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span>
                    {page} / {totalPages} ({meta.total} nodes)
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded border border-white/10 p-1 disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Level</th>
                  <th className="py-2 pr-4">Side</th>
                  <th className="py-2">Parent</th>
                </tr>
              </thead>
              <tbody>
                {(data.downline || []).map((n, i) => (
                  <tr key={`${String(n.userId)}-${i}`} className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">{String(n.userId ?? "—")}</td>
                    <td className="py-2 pr-4">{n.level ?? "—"}</td>
                    <td className="py-2 pr-4">{n.side ?? "—"}</td>
                    <td className="py-2 font-mono text-xs">{n.parentUserId ? String(n.parentUserId) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {meta && meta.total === 0 && <p className="text-sm text-slate-500 mt-4">No downline nodes.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
