"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  Send,
  UserRound,
  IndianRupee,
  CheckCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatInr } from "@/lib/formatInr";
import { getWalletMe, postFundTransferToUser } from "@/lib/api";

export default function FundTransferToUser() {
  const [form, setForm] = useState({
    toUserCode: "",
    amount: "",
    note: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fetchingWallet, setFetchingWallet] = useState(false);
  const [eligible, setEligible] = useState(0);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadWallet() {
    try {
      setFetchingWallet(true);
      const res = await getWalletMe();
      setEligible(res.data?.eligibleToWithdraw ?? 0);
    } finally {
      setFetchingWallet(false);
    }
  }

  useEffect(() => {
    void loadWallet();
  }, []);

  const canSubmit = useMemo(() => {
    const amount = Number(form.amount);
    return Boolean(form.toUserCode.trim()) && amount > 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);

    try {
      setSubmitting(true);
      await postFundTransferToUser({
        toUserCode: form.toUserCode.trim(),
        amount: Number(form.amount),
        note: form.note.trim(),
      });
      setSuccess(true);
      setForm({ toUserCode: "", amount: "", note: "" });
      await loadWallet();
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">
      <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Transfer to User</h1>
          <p className="text-slate-400 text-sm mt-1">Use User ID to transfer funds</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/userdashboard/fund-transfer/user-transfer-history" className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2">
            <History size={15} />
            History
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
          <div className="bg-[#0b0f1a]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-semibold mb-6">Transfer details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Recipient User ID</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={form.toUserCode}
                    onChange={(e) => setForm({ ...form, toUserCode: e.target.value.toUpperCase() })}
                    placeholder="Enter user ID (example: USRAB12CD34)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    value={form.amount}
                    min={1}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Available eligible amount: {formatInr(eligible)}
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Note (optional)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 text-slate-400" size={16} />
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Add note"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                disabled={fetchingWallet || submitting || !canSubmit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  "Processing..."
                ) : (
                  <>
                    <Send size={16} />
                    Transfer Funds
                  </>
                )}
              </motion.button>
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error}</div>
            )}

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                >
                  <CheckCircle className="text-green-400" />
                  <span className="text-sm text-green-300">
                    Transfer successful.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}