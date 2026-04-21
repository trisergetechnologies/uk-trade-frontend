"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  User,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export default function UserTransferHistory() {
  const [search, setSearch] = useState("");

  const data = [
    { id: 1, to: "user123", amount: 1000, date: "2026-04-15" },
    { id: 2, to: "user456", amount: 2500, date: "2026-04-14" },
    { id: 3, to: "user789", amount: 4200, date: "2026-04-13" },
  ];

  const filteredData = data.filter((item) =>
    item.to.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = data.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Your Transfers</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track all your sent transactions
        </p>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">Total Sent</p>
            <h2 className="text-2xl font-semibold mt-1">
              ₹ {totalAmount.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">Transactions</p>
            <h2 className="text-2xl font-semibold mt-1">
              {data.length}
            </h2>
          </div>
        </div>

      </div>

      {/* ---------- SEARCH ---------- */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="max-w-6xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

          {/* Table Head */}
          <div className="grid grid-cols-3 px-6 py-4 text-sm text-slate-400 border-b border-white/10">
            <span>User</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {filteredData.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-3 px-6 py-5 items-center hover:bg-white/5 transition"
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <User size={16} className="text-indigo-400" />
                  </div>
                  <span>{item.to}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={14} />
                  {item.date}
                </div>

                {/* Amount */}
                <div className="flex justify-end items-center gap-2 text-indigo-400 font-semibold">
                  <ArrowUpRight size={16} />
                  ₹ {item.amount}
                </div>
              </motion.div>
            ))}

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No transfers found
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}