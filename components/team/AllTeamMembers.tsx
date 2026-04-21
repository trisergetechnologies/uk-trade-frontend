"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Layers,
  Search,
  User,
} from "lucide-react";

export default function AllTeamMembers() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");

  const members = [
    { id: 1, name: "Rahul", username: "rahul123", level: 1, sponsor: "You", join: "2026-04-10", status: "Active" },
    { id: 2, name: "Amit", username: "amit456", level: 2, sponsor: "Rahul", join: "2026-04-09", status: "Active" },
    { id: 3, name: "Suresh", username: "suresh789", level: 3, sponsor: "Amit", join: "2026-04-08", status: "Inactive" },
    { id: 4, name: "Neha", username: "neha999", level: 1, sponsor: "You", join: "2026-04-07", status: "Active" },
  ];

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase());

    const matchLevel =
      levelFilter === "All" || m.level === Number(levelFilter);

    return matchSearch && matchLevel;
  });

  const total = members.length;
  const levels = [...new Set(members.map((m) => m.level))].length;

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">All Team Members</h1>
        <p className="text-slate-400 text-sm mt-1">
          Complete downline overview across all levels
        </p>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Members</p>
              <h2 className="text-2xl font-semibold">{total}</h2>
            </div>
            <Users className="text-indigo-400" />
          </div>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Levels</p>
              <h2 className="text-2xl font-semibold">{levels}</h2>
            </div>
            <Layers className="text-purple-400" />
          </div>
        </div>

      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 mb-6 justify-between">

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search name or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Level Filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
        >
          <option value="All">All Levels</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
        </select>

      </div>

      {/* ---------- TABLE ---------- */}
      <div className="max-w-7xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 overflow-hidden">

          {/* Head */}
          <div className="grid grid-cols-5 px-6 py-4 text-sm text-slate-400 border-b border-white/10">
            <span>Member</span>
            <span>Level</span>
            <span>Sponsor</span>
            <span>Join Date</span>
            <span className="text-right">Status</span>
          </div>

          {/* Body */}
          <div className="divide-y divide-white/5">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-5 px-6 py-5 items-center hover:bg-white/5 transition"
              >
                {/* Member */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <User size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <p>{m.name}</p>
                    <p className="text-xs text-slate-400">{m.username}</p>
                  </div>
                </div>

                {/* Level */}
                <span className="text-sm">
                  Level {m.level}
                </span>

                {/* Sponsor */}
                <span className="text-slate-400 text-sm">
                  {m.sponsor}
                </span>

                {/* Join */}
                <span className="text-slate-400 text-sm">
                  {m.join}
                </span>

                {/* Status */}
                <div className="flex justify-end">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      m.status === "Active"
                        ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No members found
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}