"use client";

import { useState } from "react";
import {
  Send,
  User,
  IndianRupee,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FundTransferToUser() {
  const [form, setForm] = useState({
    username: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const balance = 25000; // demo wallet balance

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.username || !form.amount) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ username: "", amount: "" });

      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Fund Transfer</h1>
        <p className="text-slate-400 text-sm mt-1">
          Send funds securely to users in your network
        </p>
      </div>

      {/* ---------- BALANCE CARD ---------- */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
          <div className="bg-[#0b0f1a]/90 rounded-2xl border border-white/10 p-6 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Available Balance</p>
              <h2 className="text-2xl font-semibold mt-1">
                ₹ {balance.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10">
              <Wallet className="text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- FORM ---------- */}
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
          <div className="bg-[#0b0f1a]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10">

            <h2 className="text-xl font-semibold mb-6">
              Transfer to User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                {/* Hint */}
                <p className="text-xs text-slate-500 mt-2">
                  Minimum transfer ₹100
                </p>
              </div>

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Send size={16} />
                    Transfer Funds
                  </>
                )}
              </motion.button>

            </form>

            {/* ---------- SUCCESS STATE ---------- */}
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
                    Transfer successful!
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