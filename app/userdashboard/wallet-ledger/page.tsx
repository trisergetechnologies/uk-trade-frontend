"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { getWalletLedger, type LedgerRow, type PaginatedMeta } from "@/lib/api";
import WalletLedgerTable from "@/components/wallet/WalletLedgerTable";

const PAGE_SIZE = 15;

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

        <WalletLedgerTable
          rows={rows}
          loading={loading}
          meta={meta}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
