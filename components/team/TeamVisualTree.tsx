"use client";



import { useEffect, useRef, useState } from "react";

import { ArrowRight, Search, Users } from "lucide-react";

import type { ApiSuccess, TeamFocusWindowDto, TeamTreeNode } from "@/lib/api";

import { getMyTeamFocusWindow } from "@/lib/api";

import {

  fetchFocusWindowDeduped,

  focusWindowCacheKey,

  getCachedFocusWindow,

} from "@/lib/teamFocusCache";



const MAX_TREE_DEPTH = 5;



type Props = {

  loading: boolean;

  fetchFocusWindow?: (targetUserCode?: string, depth?: number) => Promise<ApiSuccess<TeamFocusWindowDto>>;

  variant?: "user" | "admin";

  cacheScope?: string;

};



function cardWidth(viewDepth: number, rowLevel: number): number {

  const maxW = 220;

  const minW = 108;

  if (viewDepth <= 1) return maxW;

  const t = (rowLevel - 1) / Math.max(1, viewDepth - 1);

  return Math.round(maxW - t * (maxW - minW));

}



function nodeClass(width: number) {

  return `rounded-lg border border-white/10 bg-white/5 p-2 shrink-0`;

}



function NodeCard({

  node,

  caption,

  width,

  onFocus,

}: {

  node: TeamTreeNode | null;

  caption: string;

  width: number;

  onFocus?: (userCode: string) => void;

}) {

  if (!node) {

    return (

      <div className={nodeClass(width)} style={{ width }}>

        <p className="text-[10px] text-slate-500">{caption}: Not available</p>

      </div>

    );

  }



  const fontName = width >= 180 ? "text-[13px]" : width >= 140 ? "text-[12px]" : "text-[11px]";

  const fontMeta = width >= 140 ? "text-[10px]" : "text-[9px]";



  return (

    <button

      type="button"

      onClick={() => node.memberUserCode && onFocus?.(node.memberUserCode)}

      className={`${nodeClass(width)} text-left hover:border-indigo-400/40 transition-colors`}

      style={{ width }}

    >

      <p className={`${fontMeta} text-slate-400 mb-0.5 truncate`}>{caption}</p>

      <p className={`${fontName} font-semibold text-white truncate`}>{node.memberName || "-"}</p>

      <p className={`${fontMeta} text-slate-300 truncate`}>{node.memberUserCode || "-"}</p>

      <div className="mt-1.5 flex flex-wrap gap-0.5">

        <span className={`${fontMeta} px-1 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 capitalize`}>

          {node.community}

        </span>

        <span className={`${fontMeta} px-1 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 capitalize`}>

          {node.side}

        </span>

        <span className={`${fontMeta} px-1 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-200`}>

          L{node.level}

        </span>

      </div>

      <p className={`mt-1 ${fontMeta} leading-tight ${node.memberIsActive ? "text-emerald-300" : "text-red-300"}`}>

        Children: {node.directChildrenCount || 0} | {node.memberIsActive ? "Active" : "Inactive"}

      </p>

    </button>

  );

}



export default function TeamVisualTree({ loading, fetchFocusWindow, variant = "user", cacheScope = "user" }: Props) {

  const scope = cacheScope || "user";

  const [search, setSearch] = useState("");

  const [viewDepth, setViewDepth] = useState(MAX_TREE_DEPTH);

  const [error, setError] = useState<string | null>(null);

  const [windowData, setWindowData] = useState<TeamFocusWindowDto | null>(() => {

    return getCachedFocusWindow(focusWindowCacheKey(undefined, scope));

  });

  const [initialLoading, setInitialLoading] = useState(() => !getCachedFocusWindow(focusWindowCacheKey(undefined, scope)));

  const [refreshing, setRefreshing] = useState(false);

  const [focusUserCode, setFocusUserCode] = useState<string | undefined>(undefined);



  const fetchFocusWindowRef = useRef(fetchFocusWindow);

  fetchFocusWindowRef.current = fetchFocusWindow;



  const requestSeqRef = useRef(0);



  useEffect(() => {

    const cacheKey = focusWindowCacheKey(focusUserCode, scope);

    const cached = getCachedFocusWindow(cacheKey);

    if (cached) {

      setWindowData(cached);

      setError(null);

      setInitialLoading(false);

      setRefreshing(false);

      return;

    }



    const seq = ++requestSeqRef.current;

    const hadVisibleTree = Boolean(windowData?.focus);

    if (!hadVisibleTree) {

      setInitialLoading(true);

    } else {

      setRefreshing(true);

    }

    setError(null);



    const fetcher = fetchFocusWindowRef.current ?? getMyTeamFocusWindow;



    void fetchFocusWindowDeduped(cacheKey, () => fetcher(focusUserCode, MAX_TREE_DEPTH))

      .then((data) => {

        if (seq !== requestSeqRef.current) return;

        setWindowData(data);

      })

      .catch((e) => {

        if (seq !== requestSeqRef.current) return;

        setError(e instanceof Error ? e.message : "Failed to load focused tree");

      })

      .finally(() => {

        if (seq !== requestSeqRef.current) return;

        setInitialLoading(false);

        setRefreshing(false);

      });

  }, [focusUserCode, scope]);



  const handleFocus = (userCode?: string) => {

    const next = userCode?.trim() || undefined;

    if (next === focusUserCode) return;

    setFocusUserCode(next);

  };



  const showBlockingLoader = (loading && initialLoading) || (initialLoading && !windowData?.focus);

  const focus = windowData?.focus || null;

  const visibleLevels = (windowData?.levels || []).filter((lvl) => lvl.relativeLevel <= viewDepth);



  return (

    <div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">

        <p className="font-medium text-white mb-2">Team tree (up to 5 levels)</p>

        <p className="text-xs text-slate-400 mb-2">

          Select a depth to show levels 1 through that number. Card size shrinks as depth increases.{" "}

          <span className="text-emerald-300">Active</span> = purchased a package ·{" "}

          <span className="text-red-300">Inactive</span> = no purchase yet.

        </p>

        <div className="flex flex-wrap gap-2">

          {[1, 2, 3, 4, 5].map((d) => (

            <button

              key={d}

              type="button"

              onClick={() => setViewDepth(d)}

              className={`px-3 py-1.5 rounded-lg text-xs border ${

                viewDepth === d

                  ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-100"

                  : "border-white/10 bg-white/5 text-slate-300"

              }`}

            >

              Level {d}

            </button>

          ))}

        </div>

      </div>



      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">

        <div className="relative">

          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input

            value={search}

            onChange={(e) => setSearch(e.target.value.toUpperCase())}

            onKeyDown={(e) => {

              if (e.key === "Enter") handleFocus(search.trim() || undefined);

            }}

            placeholder={

              variant === "admin" ? "Search user ID in this member's tree" : "Search user ID and set focus context"

            }

            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"

          />

        </div>



        <div className="flex flex-wrap items-center gap-2 md:col-span-2">

          <button

            type="button"

            onClick={() => handleFocus(search.trim() || undefined)}

            disabled={refreshing}

            className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-sm border border-indigo-400/30 bg-indigo-500/20 text-indigo-100 disabled:opacity-50"

          >

            Focus

          </button>

          <button

            type="button"

            onClick={() => {

              setSearch("");

              handleFocus(undefined);

            }}

            disabled={refreshing}

            className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-sm border border-emerald-400/30 bg-emerald-500/20 text-emerald-100 disabled:opacity-50"

          >

            {variant === "admin" ? "Show root context" : "Show My Context"}

          </button>

        </div>

      </div>



      <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 p-4 min-h-[50vh] max-h-[75vh] overflow-auto relative">

          {refreshing && !showBlockingLoader && (

            <div className="absolute top-3 right-3 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-slate-300">

              Updating…

            </div>

          )}



          {showBlockingLoader && (

            <div className="text-center py-10 text-slate-400 text-sm">Loading tree...</div>

          )}

          {error && !showBlockingLoader && (

            <div className="text-center py-10 text-red-300 text-sm">{error}</div>

          )}



          {!showBlockingLoader && !error && focus && (

            <div className="min-w-max space-y-6 pb-4">

              {windowData?.parent && (

                <div className="flex items-center justify-center text-xs text-slate-400">

                  <span className="inline-flex items-center gap-1">

                    <ArrowRight size={12} />

                    Parent: {windowData.parent.memberName} ({windowData.parent.memberUserCode})

                  </span>

                </div>

              )}



              <div className="flex justify-center">

                <NodeCard

                  node={focus}

                  caption="Focused User"

                  width={cardWidth(viewDepth, 1)}

                  onFocus={handleFocus}

                />

              </div>



              {visibleLevels.map((levelRow) => {

                const w = cardWidth(viewDepth, levelRow.relativeLevel);

                return (

                  <div key={`level-${levelRow.relativeLevel}`}>

                    <p className="text-center text-xs text-slate-500 mb-2">

                      Level {levelRow.relativeLevel} · {levelRow.nodes.length} member

                      {levelRow.nodes.length === 1 ? "" : "s"}

                    </p>

                    <div className="flex flex-wrap justify-center gap-2">

                      {levelRow.nodes.map((node) => (

                        <NodeCard

                          key={`${levelRow.relativeLevel}-${node.memberUserCode}`}

                          node={node}

                          caption={`L${levelRow.relativeLevel}`}

                          width={w}

                          onFocus={handleFocus}

                        />

                      ))}

                    </div>

                  </div>

                );

              })}



              {visibleLevels.every((l) => l.nodes.length === 0) && (

                <p className="text-center text-sm text-slate-500">No downline members in the selected depth.</p>

              )}

            </div>

          )}



          {!showBlockingLoader && !error && !windowData?.focus && (

            <div className="text-center py-10 text-slate-300 text-sm">Tree context not available.</div>

          )}

        </div>

      </div>



      <div className="mt-3 text-xs text-slate-400 flex items-center justify-between gap-2 flex-wrap">

        <span className="inline-flex items-center gap-1">

          <Users size={12} />

          Relation: {windowData?.relation || "self"}

        </span>

        <span>Showing levels 1–{viewDepth} under focused user</span>

      </div>

    </div>

  );

}


