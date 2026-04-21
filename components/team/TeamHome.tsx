"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Search,
  ArrowRight,
} from "lucide-react";

export default function TeamHome() {
  const [search, setSearch] = useState("");

  const data = [
    {
      id: 1,
      name: "Rahul Sharma",
      username: "rahul123",
      level: 1,
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Verma",
      username: "amit456",
      level: 2,
      status: "Inactive",
    },
    {
      id: 3,
      name: "Neha Singh",
      username: "neha789",
      level: 1,
      status: "Active",
    },
  ];

  const filtered = data.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = data.length;
  const active = data.filter((u) => u.status === "Active").length;

  // ✅ centralized navigation
  const actions = [
    {
      name: "All Team Members",
      href: "/userdashboard/team/allteam",
      color: "from-indigo-600 to-purple-600",
    },
    {
      name: "Sponsor Team",
      href: "/userdashboard/team/sponsor-team",
      color: "from-green-600 to-emerald-600",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Team</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage and analyze your network structure
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent"
        >
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Members</p>
              <h2 className="text-2xl font-semibold mt-1">{total}</h2>
            </div>
            <Users className="text-indigo-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-[1px] rounded-2xl bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-transparent"
        >
          <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Active Members</p>
              <h2 className="text-2xl font-semibold mt-1">{active}</h2>
            </div>
            <UserCheck className="text-green-400" />
          </div>
        </motion.div>

      </div>

      {/* NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {actions.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} flex justify-between items-center hover:scale-[1.02] transition`}
          >
            <span className="font-medium text-white">{item.name}</span>
            <ArrowRight />
          </Link>
        ))}
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search team member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 rounded-3xl border border-white/10 overflow-hidden">

          <div className="grid grid-cols-4 px-6 py-4 text-sm text-slate-400 border-b border-white/10">
            <span>Name</span>
            <span>Username</span>
            <span>Level</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-white/5">
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-4 px-6 py-5 items-center hover:bg-white/5 transition"
              >
                <span>{user.name}</span>
                <span className="text-slate-400 text-sm">
                  {user.username}
                </span>
                <span>Level {user.level}</span>

                <div className="flex justify-end">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      user.status === "Active"
                        ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No team members found
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}