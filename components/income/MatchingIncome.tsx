"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const data = [
  { id: 1, user: "Rahul", amount: 500, left: 250, right: 250, date: "2026-04-15" },
  { id: 2, user: "Amit", amount: 700, left: 350, right: 350, date: "2026-04-14" },
];

export default function MatchingIncome() {
  const [filter, setFilter] = useState("All");

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Matching Income
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Earnings from binary pairing (Left vs Right)
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <p className="text-sm text-slate-300">Total Matching Income</p>
          <h1 className="text-3xl font-bold mt-1">₹{total}</h1>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {["All", "Today", "This Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-500"
                  : "text-slate-400 border-white/10 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#050816]">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="px-4 text-left">Pair (L:R)</th>
                <th className="px-4 text-left">Amount</th>
                <th className="px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <motion.tr
                  key={item.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-b border-white/5"
                >
                  {/* USER */}
                  <td className="px-4 py-3 font-medium text-white">
                    {item.user}
                  </td>

                  {/* PAIR */}
                  <td className="px-4 text-xs text-slate-300">
                    <span className="text-green-400">{item.left}</span>
                    {" : "}
                    <span className="text-blue-400">{item.right}</span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 font-semibold text-green-400">
                    ₹{item.amount}
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
          {data.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No matching income found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}