"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminCommunityTotals,
  getAdminCommunityUsers,
  type AdminCommunityTotalsDto,
  type CommunityMemberRow,
  type PaginatedMeta,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 25;

export default function AdminCommunityPage() {
  const [community, setCommunity] = useState<"left" | "right">("left");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CommunityMemberRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totals, setTotals] = useState<AdminCommunityTotalsDto | null>(null);
  const [totalsError, setTotalsError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminCommunityUsers({ community, page, limit: PAGE_SIZE, q });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [community, page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setTotalsError("");
        const res = await getAdminCommunityTotals();
        if (!cancelled) setTotals(res.data);
      } catch (err) {
        if (!cancelled) setTotalsError(err instanceof Error ? err.message : "Failed to load totals");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Community members</h1>
        <p className="text-sm text-slate-400">All users by binary-tree community (left / right).</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-300/80">Left community users</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {totals ? totals.left.users : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-300/80">Left investment</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {totals ? formatInr(totals.left.investment) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="text-xs uppercase tracking-wide text-indigo-300/80">Right community users</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {totals ? totals.right.users : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="text-xs uppercase tracking-wide text-indigo-300/80">Right investment</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {totals ? formatInr(totals.right.investment) : "—"}
          </p>
        </div>
      </div>
      {totalsError && <p className="text-xs text-amber-400">{totalsError}</p>}

      <div className="flex flex-wrap gap-2">
        {(["left", "right"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setPage(1);
              setCommunity(c);
            }}
            className={`px-4 py-2 rounded-lg text-sm capitalize border ${
              community === c
                ? "bg-indigo-600/30 border-indigo-500/50 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <input
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
        placeholder="Search name, email, user code, sponsor…"
        className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[900px] text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-500 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Sponsor</th>
              <th className="px-4 py-3 text-left">Side</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((r) => (
                <tr key={`${r.memberUserCode}-${r.joinedAt}`} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    <p className="text-white">{r.memberName}</p>
                    <p className="text-xs text-slate-500">{r.memberUserCode}</p>
                  </td>
                  <td className="px-4 py-3">{r.memberEmail}</td>
                  <td className="px-4 py-3">
                    <p>{r.sponsorName}</p>
                    <p className="text-xs text-slate-500">{r.sponsorUserCode}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{r.side}</td>
                  <td className="px-4 py-3">{r.level ?? "—"}</td>
                  <td className="px-4 py-3">{r.memberIsActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-slate-500">
                  No members in this community.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>
            Page {meta.page} of {meta.totalPages} · {meta.total} nodes
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
