"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { deleteAdminHoliday, getAdminHolidays, postAdminHoliday } from "@/lib/api";
import type { HolidayRow, PaginatedMeta } from "@/lib/api";

const PAGE_SIZE = 20;

export default function AdminHolidaysPage() {
  const [rows, setRows] = useState<HolidayRow[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [dateIst, setDateIst] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await getAdminHolidays(page, PAGE_SIZE);
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load holidays");
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    setError("");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIst)) {
      setError("Use YYYY-MM-DD (IST calendar date).");
      return;
    }
    try {
      await postAdminHoliday({ dateIst, reason: reason || undefined });
      setDateIst("");
      setReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    }
  };

  const remove = async (d: string) => {
    try {
      await deleteAdminHoliday(d);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Market holidays</h1>
        <p className="text-sm text-slate-400 mt-1">NSE-style calendar entries — trade income skips these IST dates.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3 max-w-xl">
        <p className="text-xs text-slate-500 uppercase tracking-wide">Add holiday</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="YYYY-MM-DD"
            value={dateIst}
            onChange={(e) => setDateIst(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white text-sm"
          />
          <input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white text-sm"
          />
          <button
            type="button"
            onClick={() => void add()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date (IST)</th>
              <th className="px-4 py-3">Exchange</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  No holidays.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="px-4 py-3 text-white">{r.dateIst}</td>
                <td className="px-4 py-3">{r.exchange}</td>
                <td className="px-4 py-3 text-slate-400">{r.reason || "—"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => void remove(r.dateIst)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {meta.page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-white/10 p-1 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-white/10 p-1 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
