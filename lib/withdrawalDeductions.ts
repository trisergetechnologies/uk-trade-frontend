export const WITHDRAWAL_TDS_PERCENT = 5;
export const WITHDRAWAL_HANDLING_PERCENT = 5;

function round2(value: number) {
  return Number(Number(value || 0).toFixed(2));
}

export function computeWithdrawalDeductions(grossAmount: number) {
  const gross = round2(Math.max(0, grossAmount));
  const tdsAmount = round2((gross * WITHDRAWAL_TDS_PERCENT) / 100);
  const handlingAmount = round2((gross * WITHDRAWAL_HANDLING_PERCENT) / 100);
  const netPayable = round2(gross - tdsAmount - handlingAmount);
  return {
    tdsPercent: WITHDRAWAL_TDS_PERCENT,
    handlingPercent: WITHDRAWAL_HANDLING_PERCENT,
    tdsAmount,
    handlingAmount,
    netPayable,
  };
}

export type WithdrawalDeductionFields = ReturnType<typeof computeWithdrawalDeductions> & {
  amount: number;
};

export function resolveWithdrawalDeductions(row: {
  amount: number;
  tdsPercent?: number;
  handlingPercent?: number;
  tdsAmount?: number;
  handlingAmount?: number;
  netPayable?: number;
}): WithdrawalDeductionFields {
  const gross = round2(Number(row.amount) || 0);
  const hasStored =
    Number(row.netPayable) > 0 &&
    (Number(row.tdsAmount) > 0 || Number(row.handlingAmount) > 0);
  if (hasStored) {
    return {
      amount: gross,
      tdsPercent: Number(row.tdsPercent) || WITHDRAWAL_TDS_PERCENT,
      handlingPercent: Number(row.handlingPercent) || WITHDRAWAL_HANDLING_PERCENT,
      tdsAmount: round2(Number(row.tdsAmount)),
      handlingAmount: round2(Number(row.handlingAmount)),
      netPayable: round2(Number(row.netPayable)),
    };
  }
  return { amount: gross, ...computeWithdrawalDeductions(gross) };
}
