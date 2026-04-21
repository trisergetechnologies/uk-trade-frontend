"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Wallet,
} from "lucide-react";

type Withdrawal = {
  id: number;
  amount: string;
  method: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
};

export default function WithdrawHistory() {
  const initialData: Withdrawal[] = [
    { id: 1, amount: "₹2,000", method: "Bank Account", status: "Pending", date: "2026-04-15" },
    { id: 2, amount: "₹1,500", method: "UPI (Google Pay)", status: "Approved", date: "2026-04-14" },
    { id: 3, amount: "₹800", method: "Bank Account", status: "Rejected", date: "2026-04-13" },
    { id: 4, amount: "₹5,000", method: "UPI (PhonePe)", status: "Approved", date: "2026-04-10" },
    { id: 5, amount: "₹1,200", method: "Bank Account", status: "Pending", date: "2026-04-09" },
  ];

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = initialData.filter((item) => {
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    const matchSearch =
      item.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const statusConfig = {
    Approved: {
      icon: CheckCircle,
      style: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    Pending: {
      icon: Clock,
      style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    Rejected: {
      icon: XCircle,
      style: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  return (
    <section className="relative w-full py-16 px-4 flex justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[120px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-6xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)] overflow-hidden">

          {/* ---------- Header ---------- */}
          <div className="p-8 border-b border-white/10">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Wallet className="text-indigo-400" />
                  Withdrawal History
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Track all your withdrawal transactions and statuses
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>

              </div>
            </div>
          </div>

          {/* ---------- Table ---------- */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="text-slate-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-6">Amount</th>
                  <th className="text-left py-4 px-6">Method</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item, i) => {
                  const StatusIcon = statusConfig[item.status].icon;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >

                      <td className="py-4 px-6 text-white font-medium">
                        {item.amount}
                      </td>

                      <td className="py-4 px-6 text-slate-400">
                        {item.method}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status].style}`}
                        >
                          <StatusIcon size={14} />
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                    </motion.tr>
                  );
                })}
              </tbody>

            </table>
          </div>

          {/* ---------- Footer ---------- */}
          <div className="p-5 border-t border-white/10 text-xs text-slate-500 flex justify-between">

            <span>
              Showing {filteredData.length} of {initialData.length}
            </span>

            <span className="text-white font-medium">
              Total: ₹
              {initialData
                .reduce((sum, item) => sum + parseInt(item.amount.replace(/[^0-9]/g, "")), 0)
                .toLocaleString()}
            </span>

          </div>

        </div>
      </div>
    </section>
  );
}