"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  getAdminTransactionLogs,
  type AdminTransactionLogRow,
  type PaginatedMeta,
} from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 20;

function typeLabel(type: AdminTransactionLogRow["type"]) {
  if (type === "wallet_credit") return "Wallet credit";
  if (type === "package_purchase") return "Package purchase";
  if (type === "fund_request_approval") return "Fund deposit approved";
  return type;
}

function typeBadgeClass(type: AdminTransactionLogRow["type"]) {
  if (type === "wallet_credit") return "bg-emerald-500/15 text-emerald-300";
  if (type === "fund_request_approval") return "bg-amber-500/15 text-amber-300";
  return "bg-indigo-500/15 text-indigo-300";
}

function creditedByLabel(row: AdminTransactionLogRow) {
  if (row.type === "wallet_credit" || row.type === "fund_request_approval") {
    return row.adminName || "—";
  }
  return "Customer";
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminTransactionLogsPage() {
  const [rows, setRows] = useState<AdminTransactionLogRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState<"all" | "wallet_credit" | "package_purchase" | "fund_request_approval">("all");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminTransactionLogs({
        page,
        limit: PAGE_SIZE,
        type,
        q,
        from,
        to,
      });
      setRows(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transaction logs.");
    } finally {
      setLoading(false);
    }
  }, [from, page, q, to, type]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [type, q, from, to]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transaction logs</h1>
        <p className="text-sm text-slate-400">
          Wallet credits, approved fund deposits, and package purchases with date, customer, plan, and package details.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 text-sm text-slate-400">
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
            className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
          >
            <option value="all">All transactions</option>
            <option value="wallet_credit">Wallet credits</option>
            <option value="fund_request_approval">Fund deposit approvals</option>
            <option value="package_purchase">Package purchases</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-400">
          Search customer
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Name, user code, package, plan"
              className="w-full rounded-lg border border-white/10 bg-[#0b1220] py-2 pl-9 pr-3 text-sm text-white"
            />
          </div>
        </label>

        <label className="space-y-1 text-sm text-slate-400">
          From date
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-400">
          To date
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto overscroll-x-contain rounded-xl border border-white/10 bg-white/[0.03] [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[980px] whitespace-nowrap text-sm text-slate-300 md:whitespace-normal">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Date & time</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Credited by</th>
              <th className="px-4 py-3 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-slate-500">
                  No transactions found.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={`${row.type}-${row.id}`} className="border-b border-white/5">
                  <td className="px-4 py-3">{formatDateTime(row.dateTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${typeBadgeClass(row.type)}`}>
                      {typeLabel(row.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{row.customerName || "—"}</div>
                    <div className="text-xs text-slate-500">{row.customerUserCode || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.type === "package_purchase" ? (
                      <>
                        <div>{row.packageName || "—"}</div>
                        {row.packageCode ? (
                          <div className="text-xs text-slate-500">{row.packageCode}</div>
                        ) : null}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.type === "package_purchase" ? (
                      <>
                        <div>{row.planName || "—"}</div>
                        {row.planCode ? (
                          <div className="text-xs text-slate-500">{row.planCode}</div>
                        ) : null}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    <div>{formatInr(row.amount)}</div>
                    {row.type === "fund_request_approval" &&
                    row.requestedAmount != null &&
                    row.requestedAmount !== row.amount ? (
                      <div className="text-xs font-normal text-slate-500">
                        Requested {formatInr(row.requestedAmount)}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {row.type === "wallet_credit" || row.type === "fund_request_approval" ? (
                      <>
                        <div>{creditedByLabel(row)}</div>
                        {row.adminUserCode ? (
                          <div className="text-xs text-slate-500">{row.adminUserCode}</div>
                        ) : null}
                      </>
                    ) : (
                      "Customer"
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[220px] truncate text-slate-400">{row.note || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Page {meta.page} of {meta.totalPages} · {meta.total} transactions
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded border border-white/10 px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
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
