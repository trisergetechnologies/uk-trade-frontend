"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  History,
  Wallet,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function WithdrawHome() {
  return (
    <section className="relative w-full py-16 px-4 flex justify-center">

      {/* ---------- Background ---------- */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-120px] left-[-120px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* ---------- Container ---------- */}
      <div className="relative w-full max-w-4xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">

          {/* ---------- Header ---------- */}
          <div className="flex justify-between items-start mb-8">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                  <Wallet className="text-white" size={22} />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Withdraw Funds
                </h2>
              </div>

              <p className="text-slate-400 text-sm ml-1">
                Secure withdrawals directly to your bank or UPI
              </p>
            </div>

            <ShieldCheck className="hidden sm:block text-slate-600" size={34} />
          </div>

          {/* ---------- Balance Strip ---------- */}
          <div className="mb-8 flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-5">

            <div>
              <p className="text-slate-400 text-xs">Available Balance</p>
              <p className="text-white text-2xl font-semibold">₹ 18,750</p>
            </div>

            <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Eligible
            </div>

          </div>

          {/* ---------- Actions ---------- */}
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Send Request */}
            <motion.div whileHover={{ scale: 1.04 }}>
              <Link
                href="/userdashboard/withdraw/send-request"
                className="group relative block rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition" />

                <div className="relative p-6 text-center text-white">

                  <div className="mx-auto mb-4 w-fit p-4 rounded-xl bg-white/20 group-hover:scale-110 transition">
                    <ArrowUpRight size={26} />
                  </div>

                  <h3 className="text-lg font-semibold mb-1">
                    Send Withdrawal Request
                  </h3>

                  <p className="text-xs text-white/80">
                    Transfer funds to your bank or UPI
                  </p>

                  <div className="mt-3 h-[2px] w-0 bg-white mx-auto group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>

            {/* History */}
            <motion.div whileHover={{ scale: 1.04 }}>
              <Link
                href="/userdashboard/withdraw/withdraw-histroy"
                className="group relative block rounded-2xl overflow-hidden bg-white/5 border border-white/10"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition" />

                <div className="relative p-6 text-center text-white">

                  <div className="mx-auto mb-4 w-fit p-4 rounded-xl bg-white/10 group-hover:scale-110 transition">
                    <History size={26} />
                  </div>

                  <h3 className="text-lg font-semibold mb-1">
                    Withdrawal History
                  </h3>

                  <p className="text-xs text-slate-400">
                    Track all withdrawal requests
                  </p>

                  <div className="mt-3 h-[2px] w-0 bg-indigo-400 mx-auto group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>

          </div>

          {/* ---------- Info Banner ---------- */}
          <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">

            <Clock size={16} className="text-yellow-400" />

            <p className="text-xs text-slate-400">
              Withdrawals are processed within{" "}
              <span className="text-white font-medium">24–48 hours</span>. Minimum withdrawal:{" "}
              <span className="text-white font-medium">₹500</span>.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}