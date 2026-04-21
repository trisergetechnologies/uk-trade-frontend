"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

export default function AdminTransferHistory() {
  const [search, setSearch] = useState("");

  const data = [
    { id: 1, amount: 5000, status: "Approved", date: "2026-04-15" },
    { id: 2, amount: 3000, status: "Pending", date: "2026-04-14" },
    { id: 3, amount: 8000, status: "Approved", date: "2026-04-13" },
    { id: 4, amount: 1500, status: "Pending", date: "2026-04-12" },
  ];

  const filteredData = data.filter((item) =>
    item.amount.toString().includes(search)
  );

  const total = data.reduce((acc, item) => acc + item.amount, 0);
  const approved = data.filter((i) => i.status === "Approved").length;
  const pending = data.filter((i) => i.status === "Pending").length;

  const statusStyle = (status: string) => {
    if (status === "Approved")
      return "text-green-400 bg-green-500/10 border-green-500/20";
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Transfer History
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Monitor and manage all admin fund transfers
        </p>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Amount", value: `₹ ${total}` },
          { label: "Approved", value: approved },
          { label: "Pending", value: pending },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent"
          >
            <div className="rounded-2xl bg-[#0b0f1a]/90 p-5 border border-white/10">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <h2 className="text-2xl font-semibold mt-2">
                {stat.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------- FILTER BAR ---------- */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-between">

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="max-w-6xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

          {/* Table Head */}
          <div className="grid grid-cols-3 px-6 py-4 text-sm text-slate-400 border-b border-white/10">
            <span>Amount</span>
            <span>Date</span>
            <span className="text-right">Status</span>
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
                {/* Amount */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <ArrowUpRight size={16} className="text-indigo-400" />
                  </div>
                  <span className="font-medium">
                    ₹ {item.amount}
                  </span>
                </div>

                {/* Date */}
                <span className="text-slate-400 text-sm">
                  {item.date}
                </span>

                {/* Status */}
                <div className="flex justify-end">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 text-xs rounded-full border ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status === "Approved" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}