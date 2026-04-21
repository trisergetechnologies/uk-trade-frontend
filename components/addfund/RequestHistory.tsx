"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function RequestHistory() {
  const data = [
    { id: 1, amount: 1000, method: "UPI", status: "Pending", date: "2026-04-15" },
    { id: 2, amount: 2500, method: "Bank Transfer", status: "Approved", date: "2026-04-14" },
    { id: 3, amount: 500, method: "UPI", status: "Rejected", date: "2026-04-13" },
  ];

  const statusConfig = (status: string) => {
    switch (status) {
      case "Approved":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          icon: <CheckCircle size={16} />,
        };
      case "Pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: <Clock size={16} />,
        };
      default:
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: <XCircle size={16} />,
        };
    }
  };

  return (
    <section className="relative w-full py-16 px-4 flex justify-center">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-5xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">

          {/* ---------- Header ---------- */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Transaction History
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Track all your fund requests and approvals
            </p>
          </div>

          {/* ---------- Summary Strip ---------- */}
          <div className="grid grid-cols-3 gap-4 mb-10">

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs">Total</p>
              <p className="text-white font-semibold text-lg">₹ 4000</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-400 text-xs">Approved</p>
              <p className="text-white font-semibold text-lg">₹ 2500</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-yellow-400 text-xs">Pending</p>
              <p className="text-white font-semibold text-lg">₹ 1000</p>
            </div>

          </div>

          {/* ---------- List ---------- */}
          <div className="space-y-5">

            {data.map((item, i) => {
              const status = statusConfig(item.status);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >

                  {/* Left */}
                  <div className="flex flex-col">
                    <p className="text-white font-semibold text-xl">
                      ₹ {item.amount}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {item.method} • {item.date}
                    </p>
                  </div>

                  {/* Status */}
                  <div
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}
                  >
                    {status.icon}
                    {item.status}
                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}