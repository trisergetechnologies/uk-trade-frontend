"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Payout = {
  id: number;
  amount: number;
  status: "Paid" | "Pending";
  date: string;
};

const data: Payout[] = [
  { id: 1, amount: 5000, status: "Paid", date: "2026-04-15" },
  { id: 2, amount: 3200, status: "Pending", date: "2026-04-14" },
  { id: 3, amount: 2100, status: "Paid", date: "2026-04-13" },
];

export default function PayoutSummary() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = data.filter((item) => {
    return (
      (filter === "All" || item.status === filter) &&
      item.amount.toString().includes(search)
    );
  });

  const totalPaid = data
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = data
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Payout Summary
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track your withdrawals and payout history
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="p-5 rounded-2xl bg-gradient-to-r from-green-600/80 to-emerald-600/80 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <p className="text-sm text-slate-300">Total Paid</p>
            <h1 className="text-2xl font-bold mt-1">₹{totalPaid}</h1>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-600/80 to-orange-500/80 border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <p className="text-sm text-slate-300">Pending Payout</p>
            <h1 className="text-2xl font-bold mt-1">₹{totalPending}</h1>
          </div>

        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* STATUS FILTER */}
          {["All", "Paid", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-[#050816] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="px-4 text-left">Status</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <motion.tr
                  key={item.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  {/* AMOUNT */}
                  <td className="px-4 py-3 font-semibold text-green-400">
                    ₹{item.amount}
                  </td>

                  {/* STATUS */}
                  <td className="px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "Paid"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-4 text-slate-400">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No payout records found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}