"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Income = {
  id: number;
  level: string;
  amount: number;
  date: string;
};

const data: Income[] = [
  { id: 1, level: "Level 1", amount: 300, date: "2026-04-15" },
  { id: 2, level: "Level 2", amount: 200, date: "2026-04-14" },
  { id: 3, level: "Level 1", amount: 500, date: "2026-04-13" },
];

export default function LevelIncome() {
  const [levelFilter, setLevelFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) => {
    return (
      (levelFilter === "All" || item.level === levelFilter) &&
      item.level.toLowerCase().includes(search.toLowerCase())
    );
  });

  const total = filtered.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Level Income
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Earnings from your downline levels
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          <p className="text-sm text-slate-300">Total Level Income</p>
          <h1 className="text-3xl font-bold mt-1">₹{total}</h1>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* LEVEL FILTER */}
          {["All", "Level 1", "Level 2", "Level 3"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                levelFilter === lvl
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {lvl}
            </button>
          ))}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search level..."
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
                <th className="py-3 px-4 text-left">Level</th>
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
                  {/* LEVEL BADGE */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      {item.level}
                    </span>
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

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No records found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}