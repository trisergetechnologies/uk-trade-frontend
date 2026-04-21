"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, IndianRupee, Landmark } from "lucide-react";

export default function SendRequest() {
  const [form, setForm] = useState({
    amount: "",
    method: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // simulate API
    setTimeout(() => {
      console.log(form);
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="relative w-full py-16 px-4 flex justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white">
              Request Funds
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Securely add balance to grow your network
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Amount */}
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />

              <p className="text-xs text-slate-500 mt-1">
                Minimum ₹100 • Maximum ₹1,00,000
              </p>
            </div>

            {/* Method */}
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <select
                name="method"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="">Select Payment Method</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <textarea
                name="note"
                placeholder="Add a note (optional)"
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </motion.button>

          </form>

          {/* Footer Hint */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Funds are reviewed and approved by admin within a few hours
          </p>

        </div>
      </div>
    </section>
  );
}