"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, ArrowLeft, Calendar, Search } from "lucide-react";
import { formatInr } from "@/lib/formatInr";
import { getAuthMe, getMyFundTransfers, type FundTransferRow, type FundTransferType, type PaginatedMeta } from "@/lib/api";

export default function UserTransferHistory() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<FundTransferType>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<FundTransferRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [myCode, setMyCode] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await getAuthMe();
        setMyCode((me.data.userCode || me.data.id || "").toUpperCase());
      } catch {}
    })();
  }, []);

  async function loadTransfers() {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyFundTransfers(page, 10, type, {
        q: query || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
      });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load transfer history");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadTransfers();
  }, [page, type, query, fromDate, toDate]);

  const totals = useMemo(
    () => rows.reduce((acc, item) => acc + Number(item.amount || 0), 0),
    [rows]
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-3 md:p-6">
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Transfer History</h1>
          <p className="text-slate-400 text-sm mt-1">Track sent and received transfers</p>
        </div>
        <Link href="/userdashboard/fund-transfer/fund-transfer-to-user" className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2">
          <ArrowLeft size={15} />
          Back to Transfer
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">Page Total</p>
            <h2 className="text-2xl font-semibold mt-1">{formatInr(totals)}</h2>
          </div>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">Transactions</p>
            <h2 className="text-2xl font-semibold mt-1">{meta?.total || 0}</h2>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-4 flex flex-wrap items-center gap-2">
        {(["all", "sent", "received"] as FundTransferType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setPage(1);
              setType(tab);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm border ${type === tab ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-200" : "bg-white/5 border-white/10 text-slate-300"}`}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setQuery(search.trim().toUpperCase());
              }
            }}
            placeholder="Search by user ID or note"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setPage(1);
            setFromDate(e.target.value);
          }}
          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setPage(1);
            setToDate(e.target.value);
          }}
          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      <div className="max-w-5xl mx-auto mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setPage(1);
            setQuery(search.trim().toUpperCase());
          }}
          className="px-3 py-1.5 rounded-lg text-sm border border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setPage(1);
            setSearch("");
            setQuery("");
            setFromDate("");
            setToDate("");
          }}
          className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 text-slate-300"
        >
          Reset
        </button>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <div className="grid min-w-[860px] grid-cols-6 px-4 md:px-6 py-4 text-sm text-slate-400 border-b border-white/10 whitespace-nowrap">
            <span>Transfer ID</span>
            <span>Type</span>
            <span>User ID</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-white/5">
            {!loading &&
              rows.map((item) => (
                <div key={item.id} className="grid min-w-[860px] grid-cols-6 px-4 md:px-6 py-4 items-center hover:bg-white/5 transition text-sm whitespace-nowrap">
                  <div className="min-w-0">
                    <span className="text-slate-300 block truncate">{item.id}</span>
                    {item.note ? <span className="text-[11px] text-slate-500 block truncate">{item.note}</span> : null}
                  </div>
                  <span
                    className={`w-fit px-2 py-0.5 rounded-full text-xs border ${
                      String(item.fromUserCode || "").toUpperCase() === myCode
                        ? "text-rose-300 border-rose-500/30 bg-rose-500/10"
                        : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                    }`}
                  >
                    {String(item.fromUserCode || "").toUpperCase() === myCode ? "Sent" : "Received"}
                  </span>
                  <div className="flex items-center gap-2 text-slate-200">
                    <ArrowRightLeft size={14} className="text-indigo-300" />
                    <span>
                      {String(item.fromUserCode || "").toUpperCase() === myCode
                        ? item.toUserCode
                        : item.fromUserCode}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300">{item.status || "completed"}</span>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} />
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </div>
                  <div className="text-right text-indigo-300 font-semibold">{formatInr(item.amount)}</div>
                </div>
              ))}

            {loading && <div className="text-center py-10 text-slate-400 text-sm">Loading transfers...</div>}
            {error && <div className="text-center py-10 text-red-300 text-sm">{error}</div>}
            {!loading && !rows.length && (
              <div className="text-center py-10 text-slate-400 text-sm">No transfers found</div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 flex flex-wrap items-center justify-end gap-2">
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
    </div>
  );
}