"use client";

import Link from "next/link";
import { ArrowRightLeft, History, Shield } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function FundTransferHome() {

  const actions = [
    {
      name: "Transfer to User",
      description: "Instantly send funds across your network",
      href: "/userdashboard/fund-transfer/fund-transfer-to-user", // ✅ fixed
      icon: ArrowRightLeft,
      primary: true,
    },
    {
      name: "User History",
      description: "View your transfer records",
      href: "/userdashboard/fund-transfer/user-transfer-history", // ✅ fixed spelling
      icon: History,
    },
    {
      name: "Admin History",
      description: "Monitor admin-level transactions",
      href: "/userdashboard/fund-transfer/admin-transfer-history", // ✅ fixed spelling
      icon: Shield,
    },
  ];

  return (
    <section className="relative w-full py-16 px-6 flex justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600 blur-[160px] opacity-20 top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[140px] opacity-20 bottom-[-120px] right-[-120px]" />

      <div className="relative w-full max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Fund Transfer
          </h1>
          <p className="text-slate-400 mt-3">
            Seamlessly manage and track transactions across your MLM network
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {actions.map((item, index) => (
            <motion.div
              key={item.name}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.06 }}
            >
              <Link
                href={item.href}
                className={`group block rounded-3xl overflow-hidden text-center ${
                  item.primary
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                    : "bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10"
                }`}
              >
                <div className="p-8">

                  <div className="mx-auto mb-6 w-fit p-5 rounded-2xl bg-white/20 group-hover:scale-110 transition">
                    <item.icon size={32} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm mt-2 text-white/80">
                    {item.description}
                  </p>

                </div>
              </Link>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}