"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { getWalletLedger, type LedgerRow, type PaginatedMeta } from "@/lib/api";
import { formatInr } from "@/lib/formatInr";

const PAGE_SIZE = 15;

const CONTEXT_LABELS: Record<string, string> = {
  sponsor_income: "Sponsor income",
  matching_income: "Matching income",
  trade_income: "Trade income",
  package_purchase: "Package purchase",
  fund_transfer_in: "Fund transfer in",
  fund_transfer_out: "Fund transfer out",
  admin_credit: "Admin credit",
  withdrawal_approved: "Withdrawal approved",
  fund_request_approval: "Fund request approved",
};

function ledgerTypeLabel(contextType: string) {
  return CONTEXT_LABELS[contextType] || contextType.replace(/_/g, " ");
}

function ledgerSourceText(row: LedgerRow) {
  if (row.sourceLabel) return row.sourceLabel;
  if (row.sourceName && row.sourceUserCode) return `${row.sourceName} (${row.sourceUserCode})`;
  if (row.sourceName) return row.sourceName;
  if (row.contextType === "sponsor_income" || row.contextType === "matching_income") {
    return "—";
  }
  return null;
}

export default function WalletLedgerPage() {
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWalletLedger(page, PAGE_SIZE);
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-[#05070d] text-white px-3 py-6 md:px-4 md:py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start gap-3">
          <FileText className="text-indigo-400 shrink-0 mt-1" size={28} />
          <div>
            <h1 className="text-2xl font-semibold">Wallet ledger</h1>
            <p className="text-slate-400 text-sm mt-1">Credits and debits with context (paginated).</p>
          </div>
        </div>

        {error && <p className="text-sm text-amber-400">{error}</p>}

        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[720px] text-sm text-left whitespace-nowrap md:whitespace-normal">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Note</th>
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
                rows.map((r) => {
                  const source = ledgerSourceText(r);
                  return (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.04]">
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300">{ledgerTypeLabel(r.contextType)}</span>
                        <span
                          className={`ml-2 text-xs ${r.direction === "credit" ? "text-emerald-400" : "text-red-300"}`}
                        >
                          {r.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {source ? (
                          <span title={r.sourceUserCode ? `User ${r.sourceUserCode}` : undefined}>{source}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {r.direction === "credit" ? "+" : "−"}
                        {formatInr(r.amount)}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={r.notes}>
                        {r.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-slate-500">
                    No ledger entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-400">
            <p>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:opacity-40"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:opacity-40"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
