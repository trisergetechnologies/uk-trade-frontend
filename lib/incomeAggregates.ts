import type { MatchingIncomeRow, SponsorIncomeRow, TradeCreditRow } from "@/lib/api";
import { toIstYmd } from "@/lib/istDate";

export function sumTradeOnIstDate(trade: TradeCreditRow[], istYmd: string): number {
  return trade.reduce(
    (s, r) => s + (r.creditDateIst === istYmd ? (Number(r.amount) || 0) : 0),
    0
  );
}

export function sumSponsorCreditedOnIstDate(
  sponsor: SponsorIncomeRow[],
  istYmd: string
): number {
  return sponsor.reduce((s, r) => {
    if (!r.createdAt) return s;
    return toIstYmd(r.createdAt) === istYmd ? s + (Number(r.creditedAmount) || 0) : s;
  }, 0);
}

function matchingRowAmount(r: MatchingIncomeRow): number {
  const ext = r as MatchingIncomeRow & { creditedAmount?: number };
  const raw = ext.creditedAmount ?? r.amount;
  return Number(raw) || 0;
}

export function sumMatchingOnIstDate(
  rows: MatchingIncomeRow[],
  istYmd: string
): number {
  return rows.reduce((s, r) => {
    const amt = matchingRowAmount(r);
    const t = r.createdAt ?? r.creditDateIst;
    if (t) {
      if (String(t).length === 10 && !t.includes("T")) {
        return t === istYmd ? s + amt : s;
      }
      return toIstYmd(t) === istYmd ? s + amt : s;
    }
    return s;
  }, 0);
}

export function totalIncomeAllTime(
  trade: TradeCreditRow[],
  sponsor: SponsorIncomeRow[],
  matching: MatchingIncomeRow[]
) {
  const t = trade.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const sp = sponsor.reduce((s, r) => s + (Number(r.creditedAmount) || 0), 0);
  const m = matching.reduce((s, r) => s + matchingRowAmount(r), 0);
  return { trade: t, sponsor: sp, matching: m, total: t + sp + m };
}
