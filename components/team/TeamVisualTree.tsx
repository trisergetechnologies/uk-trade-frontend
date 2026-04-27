"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Search, Users } from "lucide-react";
import type { TeamFocusWindowDto, TeamTreeNode } from "@/lib/api";
import { getMyTeamFocusWindow } from "@/lib/api";

type Props = {
  loading: boolean;
};

function nodeClass(base = "") {
  return `rounded-lg border border-white/10 bg-white/5 p-2.5 ${base}`;
}

function NodeCard({
  node,
  caption,
  compact = false,
}: {
  node: TeamTreeNode | null;
  caption: string;
  compact?: boolean;
}) {
  if (!node) {
    return <div className={nodeClass("text-xs text-slate-500")}>{caption}: Not available</div>;
  }
  return (
    <div className={nodeClass(compact ? "w-[188px] shrink-0" : "w-[220px] shrink-0")}>
      <p className="text-[11px] text-slate-400 mb-1">{caption}</p>
      <p className="text-[13px] font-semibold text-white truncate">{node.memberName || "-"}</p>
      <p className="text-[11px] text-slate-300 truncate">{node.memberUserCode || "-"}</p>
      <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
        <span className="px-1.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 capitalize">
          {node.community}
        </span>
        <span className="px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 capitalize">
          {node.side}
        </span>
        <span className="px-1.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-200">
          L{node.level}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-slate-400 leading-tight">
        Children: {node.directChildrenCount || 0} | {node.memberIsActive ? "Active" : "Inactive"}
      </p>
    </div>
  );
}

export default function TeamVisualTree({ loading }: Props) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [windowData, setWindowData] = useState<TeamFocusWindowDto | null>(null);
  const [fetching, setFetching] = useState(false);

  async function loadWindow(userCode?: string) {
    try {
      setFetching(true);
      setError(null);
      const res = await getMyTeamFocusWindow(userCode);
      setWindowData(res.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load focused tree");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    void loadWindow();
  }, []);

  const effectiveLoading = loading || fetching;
  const focus = windowData?.focus || null;
  const children = windowData?.children || [];
  const grandchildrenByParent = windowData?.grandchildrenByParent || {};

  const FOCUS_W = 220;
  const CHILD_W = 188;
  const GRAND_W = 170;
  const COL_GAP = 20;
  const CARD_GAP = 10;

  const childBlockWidths = children.map((child) => {
    const g = grandchildrenByParent[child.memberUserCode] || [];
    const gWidth = g.length > 0 ? g.length * GRAND_W + (g.length - 1) * CARD_GAP : CHILD_W;
    return Math.max(CHILD_W, gWidth);
  });
  const row2Width =
    childBlockWidths.length > 0
      ? childBlockWidths.reduce((acc, w) => acc + w, 0) + (childBlockWidths.length - 1) * COL_GAP
      : FOCUS_W;
  const chartWidth = Math.max(960, FOCUS_W + 120, row2Width + 120);

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-medium text-white mb-2">Fixed context tree</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="px-2 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-200">Parent</span>
          <span className="px-2 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200">Focused User</span>
          <span className="px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">Downline</span>
          <span className="px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-200">Downline's Downline</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") void loadWindow(search.trim());
            }}
            placeholder="Search user ID and set focus context"
            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <button
            type="button"
            onClick={() => void loadWindow(search.trim())}
            className="px-3 py-2.5 rounded-xl text-sm border border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => void loadWindow()}
            className="px-3 py-2.5 rounded-xl text-sm border border-emerald-400/30 bg-emerald-500/20 text-emerald-100"
          >
            Show My Context
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch("");
            }}
            className="px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-300"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void loadWindow(search.trim())}
            className="px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-200"
          >
            Reload
          </button>
        </div>
      </div>

      <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 p-4 h-[70vh] overflow-auto">
          {effectiveLoading && <div className="text-center py-10 text-slate-400 text-sm">Loading focused tree...</div>}
          {error && <div className="text-center py-10 text-red-300 text-sm">{error}</div>}

          {!effectiveLoading && !error && focus && (
            <div className="min-w-[960px]">
              {windowData?.parent && (
                <div className="mb-3 flex items-center justify-center text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <ArrowRight size={12} />
                    Parent: {windowData.parent.memberName} ({windowData.parent.memberUserCode})
                  </span>
                </div>
              )}

              <div className="mx-auto relative" style={{ width: `${chartWidth}px` }}>
                <div className="flex justify-center">
                  <NodeCard node={focus} caption="Focused User" />
                </div>

                {children.length > 0 && (
                  <>
                    <div className="relative h-8 mt-1">
                      <div className="absolute left-1/2 top-0 h-3 w-px bg-white/25 -translate-x-1/2" />
                      <div
                        className="absolute top-3 border-t border-white/20"
                        style={{
                          left: `${(chartWidth - row2Width) / 2}px`,
                          width: `${row2Width}px`,
                        }}
                      />
                      {(() => {
                        let cursor = (chartWidth - row2Width) / 2;
                        return children.map((child, idx) => {
                          const blockW = childBlockWidths[idx] || CHILD_W;
                          const x = cursor + blockW / 2;
                          cursor += blockW + COL_GAP;
                          return (
                            <div
                              key={`line-c-${child.memberUserCode}`}
                              className="absolute top-3 h-4 w-px bg-white/25"
                              style={{ left: `${x}px` }}
                            />
                          );
                        });
                      })()}
                    </div>

                    <div
                      className="mx-auto flex items-start"
                      style={{ width: `${row2Width}px`, gap: `${COL_GAP}px` }}
                    >
                      {children.map((child, idx) => {
                        const rows = grandchildrenByParent[child.memberUserCode] || [];
                        const blockW = childBlockWidths[idx] || CHILD_W;
                        const gRowWidth =
                          rows.length > 0 ? rows.length * GRAND_W + (rows.length - 1) * CARD_GAP : blockW;
                        return (
                          <div key={`child-block-${child.memberUserCode}`} style={{ width: `${blockW}px` }}>
                            <div className="flex justify-center">
                              <NodeCard node={child} caption="Downline" compact />
                            </div>

                            <div className="mt-2 min-h-[150px]">
                              {rows.length > 0 ? (
                                <>
                                  <div className="relative h-7">
                                    <div className="absolute left-1/2 top-0 h-3 w-px bg-white/20 -translate-x-1/2" />
                                    <div
                                      className="absolute top-3 border-t border-white/15"
                                      style={{
                                        left: `${(blockW - gRowWidth) / 2}px`,
                                        width: `${gRowWidth}px`,
                                      }}
                                    />
                                    {rows.map((row, rowIdx) => (
                                      <div
                                        key={`gline-${child.memberUserCode}-${row.memberUserCode}`}
                                        className="absolute top-3 h-4 w-px bg-white/20"
                                        style={{
                                          left: `${
                                            (blockW - gRowWidth) / 2 +
                                            GRAND_W / 2 +
                                            rowIdx * (GRAND_W + CARD_GAP)
                                          }px`,
                                        }}
                                      />
                                    ))}
                                  </div>

                                  <div className="overflow-x-auto pb-1">
                                    <div
                                      className="mx-auto flex"
                                      style={{ width: `${gRowWidth}px`, gap: `${CARD_GAP}px` }}
                                    >
                                      {rows.map((n) => (
                                        <NodeCard
                                          key={`g-${child.memberUserCode}-${n.memberUserCode}`}
                                          node={n}
                                          caption="L2"
                                          compact
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center text-[11px] text-slate-500 pt-6">
                                  No L2 members
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!effectiveLoading && !error && !windowData?.focus && (
            <div className="text-center py-10 text-slate-300 text-sm space-y-2">
              <p className="font-medium text-white">Tree context not available.</p>
              <p className="text-slate-400">
                Try another user ID from your downline or reload your own context.
              </p>
              <button
                type="button"
                onClick={() => void loadWindow(search.trim())}
                className="px-3 py-2 rounded-lg text-xs border border-white/10 bg-white/5 text-slate-200"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1">
          <Users size={12} />
          Relation: {windowData?.relation || "self"}
        </span>
        <span>Showing fixed 3-level context (parent + 2 downline levels).</span>
      </div>
    </div>
  );
}

