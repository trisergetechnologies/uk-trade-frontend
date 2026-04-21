"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Income = {
  id: number;
  user: string;
  amount: number;
  date: string;
};

const data: Income[] = [
  { id: 1, user: "Rohit", amount: 1000, date: "2026-04-15" },
  { id: 2, user: "Suresh", amount: 1500, date: "2026-04-14" },
  { id: 3, user: "Aman", amount: 800, date: "2026-04-13" },
];

export default function SponsorIncome() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = data.filter((item) => {
    return (
      item.user.toLowerCase().includes(search.toLowerCase())
    );
  });

  const total = filtered.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Sponsor Income
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Earnings from your direct referrals
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-600/80 to-emerald-600/80 border border-white/10 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
          <p className="text-sm text-slate-300">Total Sponsor Income</p>
          <h1 className="text-3xl font-bold mt-1">₹{total}</h1>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* FILTER (future use) */}
          {["All", "Today", "This Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                filter === f
                  ? "bg-green-600 border-green-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search user..."
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
                <th className="py-3 px-4 text-left">User</th>
                <th className="px-4 text-left">Amount</th>
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
                  {/* USER */}
                  <td className="px-4 py-3 font-medium text-white">
                    {item.user}
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
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No sponsor income found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}