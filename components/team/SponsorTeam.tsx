"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Calendar,
  User,
} from "lucide-react";

export default function SponsorTeam() {
  const [search, setSearch] = useState("");

  const members = [
    {
      id: 1,
      name: "Rahul",
      username: "rahul123",
      join: "2026-04-10",
      status: "Active",
      earnings: 1200,
    },
    {
      id: 2,
      name: "Priya",
      username: "priya456",
      join: "2026-04-09",
      status: "Inactive",
      earnings: 500,
    },
    {
      id: 3,
      name: "Aman",
      username: "aman789",
      join: "2026-04-08",
      status: "Active",
      earnings: 2200,
    },
  ];

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase())
  );

  const total = members.length;
  const active = members.filter((m) => m.status === "Active").length;
  const totalEarnings = members.reduce((acc, m) => acc + m.earnings, 0);

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Sponsor Team</h1>
        <p className="text-slate-400 text-sm mt-1">
          Your direct referrals (Level 1 members)
        </p>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* Total */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Sponsors</p>
              <h2 className="text-2xl font-semibold">{total}</h2>
            </div>
            <Users className="text-indigo-400" />
          </div>
        </div>

        {/* Active */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <h2 className="text-2xl font-semibold">{active}</h2>
            </div>
            <UserPlus className="text-green-400" />
          </div>
        </div>

        {/* Earnings */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-transparent">
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">Total Earnings</p>
            <h2 className="text-2xl font-semibold mt-1">
              ₹ {totalEarnings}
            </h2>
          </div>
        </div>

      </div>

      {/* ---------- SEARCH ---------- */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="max-w-7xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 overflow-hidden">

          {/* Head */}
          <div className="grid grid-cols-5 px-6 py-4 text-sm text-slate-400 border-b border-white/10">
            <span>Member</span>
            <span>Join Date</span>
            <span>Status</span>
            <span>Earnings</span>
            <span className="text-right">Level</span>
          </div>

          {/* Body */}
          <div className="divide-y divide-white/5">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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

                {/* Join */}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={14} />
                  {m.join}
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    m.status === "Active"
                      ? "text-green-400 bg-green-500/10 border-green-500/20"
                      : "text-red-400 bg-red-500/10 border-red-500/20"
                  }`}
                >
                  {m.status}
                </span>

                {/* Earnings */}
                <span className="text-yellow-400 font-semibold">
                  ₹ {m.earnings}
                </span>

                {/* Level */}
                <div className="flex justify-end text-sm text-slate-400">
                  Level 1
                </div>

              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No sponsors found
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}