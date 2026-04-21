"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Users, Layers } from "lucide-react";

const incomeCards = [
  {
    title: "Matching Income",
    desc: "Binary pairing earnings",
    href: "/userdashboard/income/matching-income",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-500",
    amount: "₹12,450",
  },
  {
    title: "Sponsor Income",
    desc: "Direct referral bonus",
    href: "/userdashboard/income/sponser-income",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    amount: "₹8,200",
  },
  {
    title: "Level Income",
    desc: "Downline level earnings",
    href: "/userdashboard/income/level-income",
    icon: Layers,
    color: "from-purple-500 to-pink-500",
    amount: "₹15,980",
  },
];

export default function IncomeHome() {
  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Income Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track all your MLM earnings in one place
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          <p className="text-sm text-slate-300">Total Earnings</p>
          <h1 className="text-3xl font-bold mt-1 text-white">
            ₹36,630
          </h1>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {incomeCards.map((item, i) => {
            const Icon = item.icon;

            return (
              <Link key={i} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${item.color} shadow-xl cursor-pointer overflow-hidden border border-white/10`}
                >
                  {/* GLOW */}
                  <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20" />

                  {/* ICON */}
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/20 mb-4">
                    <Icon size={18} />
                  </div>

                  {/* TEXT */}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-xs text-white/80">{item.desc}</p>

                  {/* AMOUNT */}
                  <p className="mt-4 text-xl font-bold text-white">
                    {item.amount}
                  </p>

                  {/* HOVER LIGHT */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/5" />
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}