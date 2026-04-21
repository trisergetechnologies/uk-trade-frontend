"use client";

import Link from "next/link";
import { PlusCircle, History, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function AddFundHome() {
  const actions = [
    {
      name: "Send Fund Request",
      description: "Instantly request wallet top-up from admin",
      href: "/userdashboard/add-fund/request", // ✅ fixed
      icon: PlusCircle,
      primary: true,
    },
    {
      name: "Transaction History",
      description: "Monitor all your fund activities & approvals",
      href: "/userdashboard/add-fund/history", // ✅ fixed spelling + base
      icon: History,
      primary: false,
    },
  ];

  return (
    <section className="relative w-full py-16 px-4 flex justify-center items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[#05070d]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[300px] h-[300px] bg-indigo-500 blur-[100px] bottom-[-80px] right-[-80px]" />
      </div>

      {/* Container */}
      <div className="relative w-full max-w-5xl rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">

        <div className="bg-[#0b0f1a]/90 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg mb-4">
              <Wallet size={32} className="text-white" />
            </div>

            <h2 className="text-4xl font-bold text-white">Add Funds</h2>
            <p className="text-slate-400 mt-3 max-w-md">
              Boost your MLM network growth with seamless wallet funding
            </p>
          </div>

          {/* Balance */}
          <div className="mb-10 rounded-2xl bg-white/5 border border-white/10 p-5 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Available Balance</p>
              <p className="text-2xl font-semibold text-white">₹ 12,500</p>
            </div>

            <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Active
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-8">

            {actions.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className={`group relative block rounded-2xl overflow-hidden ${
                    item.primary
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                      : "border border-white/10 bg-white/5 backdrop-blur-xl"
                  }`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition" />

                  <div className="relative p-8 text-center text-white">

                    <div className="mx-auto mb-5 w-fit p-4 rounded-xl bg-white/20 group-hover:scale-110 transition">
                      <item.icon size={30} />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      {item.name}
                    </h3>

                    <p className="text-sm text-white/80">
                      {item.description}
                    </p>

                    <div className="mt-4 h-[2px] w-0 bg-white mx-auto group-hover:w-20 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}