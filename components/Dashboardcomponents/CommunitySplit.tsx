"use client";

import { useEffect, useState } from "react";
import { Users, BadgeIndianRupee } from "lucide-react";
import {
  getMyTeamMembers,
  getMyTeamSummary,
  type PaginatedMeta,
  type TeamMemberRow,
  type TeamSummaryDto,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const CARD_BASE =
  "rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-4 md:p-5 flex items-start gap-3";

type CardProps = {
  title: string;
  value: string;
  side: "left" | "right";
  icon: React.ReactNode;
};

function StatBlock({ title, value, side, icon }: CardProps) {
  const accent =
    side === "left"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
      : "text-indigo-300 bg-indigo-500/10 border-indigo-500/20";
  return (
    <div className={CARD_BASE}>
      <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
        <p className="text-lg md:text-xl font-semibold text-white mt-1 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function CommunitySplit() {
  const [data, setData] = useState<TeamSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<"left" | "right">("left");
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyTeamSummary();
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load community");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingMembers(true);
        const res = await getMyTeamMembers(page, 8, { type: "all", community });
        if (cancelled) return;
        setMembers(res.data || []);
        setMeta(res.meta || null);
      } catch {
        if (!cancelled) {
          setMembers([]);
          setMeta(null);
        }
      } finally {
        if (!cancelled) setLoadingMembers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [community, page]);

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base md:text-lg font-semibold text-white">Community split</h3>
        <p className="text-xs text-slate-500">Your downline by binary branch</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBlock
          title="Left purchased members"
          value={String(data.myLeftMembers)}
          side="left"
          icon={<Users size={18} />}
        />
        <StatBlock
          title="Right purchased members"
          value={String(data.myRightMembers)}
          side="right"
          icon={<Users size={18} />}
        />
        <StatBlock
          title="Left investment"
          value={formatInr(data.myLeftInvestment || 0)}
          side="left"
          icon={<BadgeIndianRupee size={18} />}
        />
        <StatBlock
          title="Right investment"
          value={formatInr(data.myRightInvestment || 0)}
          side="right"
          icon={<BadgeIndianRupee size={18} />}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0f1a]/90 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <p className="text-sm font-medium text-white">Downline community users</p>
          <div className="flex gap-2">
            {(["left", "right"] as const).map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => {
                  setCommunity(side);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize border ${
                  community === side
                    ? "bg-indigo-600/30 border-indigo-500/50 text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">User ID</th>
                <th className="px-4 py-3 text-left">Sponsor</th>
                <th className="px-4 py-3 text-left">Level</th>
                <th className="px-4 py-3 text-left">Package status</th>
              </tr>
            </thead>
            <tbody>
              {loadingMembers && (
                <tr>
                  <td className="px-4 py-8 text-slate-500" colSpan={5}>
                    Loading users...
                  </td>
                </tr>
              )}
              {!loadingMembers &&
                members.map((row) => (
                  <tr key={`${row.memberUserCode}-${row.joinedAt || row.level}`} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <p className="text-white">{row.memberName || "-"}</p>
                      <p className="text-xs text-slate-500">{row.memberEmail || "-"}</p>
                    </td>
                    <td className="px-4 py-3">{row.memberUserCode || "-"}</td>
                    <td className="px-4 py-3">
                      <p>{row.sponsorName || "-"}</p>
                      <p className="text-xs text-slate-500">{row.sponsorUserCode || "-"}</p>
                    </td>
                    <td className="px-4 py-3">Level {row.level}</td>
                    <td className="px-4 py-3">
                      <span className={row.memberIsActive ? "text-emerald-300" : "text-red-300"}>
                        {row.memberIsActive ? "Active (purchased)" : "Inactive (no package)"}
                      </span>
                    </td>
                  </tr>
                ))}
              {!loadingMembers && !members.length && (
                <tr>
                  <td className="px-4 py-8 text-slate-500" colSpan={5}>
                    No users found in {community} community.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.total > 0 && (
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
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
    </section>
  );
}
