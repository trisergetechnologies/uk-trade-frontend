"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers, Search, ShieldCheck, Users } from "lucide-react";
import {
  getMyTeamMembers,
  getMyTeamSummary,
  type TeamMemberRow,
  type TeamTypeFilter,
  type TeamSummaryDto,
  type PaginatedMeta,
} from "@/lib/api";
import TeamVisualTree from "@/components/team/TeamVisualTree";

export default function TeamHome() {
  const [summary, setSummary] = useState<TeamSummaryDto | null>(null);
  const [rows, setRows] = useState<TeamMemberRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [type, setType] = useState<TeamTypeFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("");
  const [view, setView] = useState<"members" | "tree">("tree");

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const summaryRes = await getMyTeamSummary();
      setSummary(summaryRes.data);
      if (view === "members") {
        const membersRes = await getMyTeamMembers(page, 12, {
          type,
          q: query || undefined,
          level: level ? Number(level) : undefined,
        });
        setRows(membersRes.data || []);
        setMeta(membersRes.meta || null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [page, type, query, level, view]);

  const levelOptions = useMemo(() => {
    const max = Math.max(1, summary?.maxLevel || 1);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [summary]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">My Team</h1>
          <p className="text-slate-400 text-sm mt-1">Track your direct and full downline with filters and pagination.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
          <button
            onClick={() => {
              setView("members");
              setPage(1);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm border ${
              view === "members" ? "border-indigo-400/30 bg-indigo-500/20 text-indigo-100" : "border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setView("tree")}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm border ${
              view === "tree" ? "border-indigo-400/30 bg-indigo-500/20 text-indigo-100" : "border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            Member Tree
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Team</p>
              <h2 className="text-2xl font-semibold mt-1">{summary?.totalMembers || 0}</h2>
            </div>
            <Users className="text-indigo-400" />
          </div>
        </div>
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Direct Referrals</p>
              <h2 className="text-2xl font-semibold mt-1">{summary?.directMembers || 0}</h2>
            </div>
            <ShieldCheck className="text-emerald-400" />
          </div>
        </div>
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Active (Purchased)</p>
              <h2 className="text-2xl font-semibold mt-1">{summary?.activeMembers || 0}</h2>
            </div>
            <Users className="text-violet-400" />
          </div>
        </div>
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Inactive (No package)</p>
              <h2 className="text-2xl font-semibold mt-1">{summary?.inactiveMembers || 0}</h2>
            </div>
            <Layers className="text-amber-400" />
          </div>
        </div>
      </div>

      {view === "members" && (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search by name, email, user ID, sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setQuery(search.trim());
              }
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
          />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value as TeamTypeFilter);
          }}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm"
        >
          <option value="all">All Downline</option>
          <option value="direct">Direct Only</option>
        </select>
        <select
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm"
        >
          <option value="">All Levels</option>
          {levelOptions.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </div>
      )}

      {view === "members" && (
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setPage(1);
            setQuery(search.trim());
          }}
          className="px-3 py-1.5 rounded-lg text-sm border border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setPage(1);
            setSearch("");
            setQuery("");
            setLevel("");
            setType("all");
          }}
          className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 text-slate-300"
        >
          Reset
        </button>
      </div>
      )}

      {view === "members" ? (
      <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <div className="grid min-w-[860px] grid-cols-6 px-4 md:px-6 py-4 text-sm text-slate-400 border-b border-white/10 whitespace-nowrap">
            <span>Member</span>
            <span>User ID</span>
            <span>Sponsor</span>
            <span>Level</span>
            <span>Community</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-white/5">
            {!loading &&
              rows.map((user, i) => (
                <div key={`${user.memberUserCode}-${i}`} className="grid min-w-[860px] grid-cols-6 px-4 md:px-6 py-4 items-center hover:bg-white/5 transition text-sm whitespace-nowrap">
                  <div className="min-w-0">
                    <p className="text-white truncate">{user.memberName || "-"}</p>
                    <p className="text-xs text-slate-400 truncate">{user.memberEmail || "-"}</p>
                  </div>
                  <span className="text-slate-300">{user.memberUserCode || "-"}</span>
                  <div className="min-w-0">
                    <p className="text-slate-300 truncate">{user.sponsorName || "-"}</p>
                    <p className="text-xs text-slate-500 truncate">{user.sponsorUserCode || "-"}</p>
                  </div>
                  <span>Level {user.level}</span>
                  <span className="capitalize text-slate-300">{user.community}</span>
                  <div className="flex justify-end">
                    <span className={`px-2.5 py-1 text-xs rounded-full border ${user.memberIsActive ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
                      {user.memberIsActive ? "Active (purchased)" : "Inactive (no package)"}
                    </span>
                  </div>
                </div>
              ))}

            {loading && <div className="text-center py-10 text-slate-400 text-sm">Loading team members...</div>}
            {error && <div className="text-center py-10 text-red-300 text-sm">{error}</div>}
            {!loading && !rows.length && <div className="text-center py-10 text-slate-400 text-sm">No team members found</div>}
          </div>
        </div>
      </div>
      ) : (
        <TeamVisualTree loading={loading} />
      )}

      {view === "members" && (
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <span className="text-xs text-slate-400 mr-2">
          Page {meta?.page || 1} of {meta?.totalPages || 1}
        </span>
        <button
          disabled={!meta || page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={!meta || page >= (meta?.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      )}
    </div>
  );
}