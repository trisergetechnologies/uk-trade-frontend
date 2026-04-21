"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Landmark,
  User,
  Send,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function WithdrawRequestNewUI() {
  const [form, setForm] = useState({
    amount: "",
    method: "",
    account: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const minAmount = 500;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isAmountValid =
    !form.amount || parseInt(form.amount) >= minAmount;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!form.amount || !form.method || !form.account) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ amount: "", method: "", account: "" });

      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4">

      {/* Background */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600 blur-[140px] opacity-20 top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-3xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">

          {/* ---------- Header ---------- */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">
              Withdraw Funds
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Complete the steps below to transfer funds securely
            </p>
          </div>

          {/* ---------- Step Indicator ---------- */}
          <div className="flex justify-between mb-10 text-xs text-slate-400">
            <span className="text-indigo-400">1. Amount</span>
            <span>2. Method</span>
            <span>3. Account</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Amount */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Enter Amount
              </label>

              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="500 - 50,000"
                  className={`w-full pl-10 pr-4 py-4 text-lg rounded-xl bg-white/5 border text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 ${
                    form.amount && !isAmountValid
                      ? "border-red-500/40"
                      : "border-white/10"
                  }`}
                />
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Minimum ₹500 • Maximum ₹50,000
              </p>

              {!isAmountValid && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  Invalid amount
                </p>
              )}
            </div>

            {/* Method */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Select Method
              </label>

              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, method: "bank" })
                  }
                  className={`p-4 rounded-xl border transition ${
                    form.method === "bank"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <Landmark className="mx-auto mb-2 text-white" />
                  <p className="text-white text-sm">Bank Transfer</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, method: "upi" })
                  }
                  className={`p-4 rounded-xl border transition ${
                    form.method === "upi"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <User className="mx-auto mb-2 text-white" />
                  <p className="text-white text-sm">UPI</p>
                </button>

              </div>
            </div>

            {/* Account */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Account Details
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  placeholder={
                    form.method === "upi"
                      ? "name@upi"
                      : "Account No + IFSC"
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Security Box */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="text-green-400" />
              <p className="text-xs text-slate-400">
                Secure encrypted withdrawal • Admin verified
              </p>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading || !isAmountValid}
              className="w-full py-4 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </motion.button>

          </form>

          {/* Success */}
          {success && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-xl border border-green-500/20">
              <CheckCircle2 size={16} />
              Request Submitted
            </div>
          )}

        </div>
      </div>
    </section>
  );
}