"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How to add funds?",
    a: "Go to Add Fund → Send Request → Submit payment details and wait for admin approval.",
  },
  {
    q: "How to withdraw money?",
    a: "Navigate to Withdraw → Submit request → Funds will be processed after approval.",
  },
  {
    q: "How long does approval take?",
    a: "Usually within 24 hours depending on admin verification.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen w-full px-6 py-20 flex justify-center overflow-hidden">

      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-[#05070d]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[140px] opacity-20 top-[-100px] left-[-100px]" />
      <div className="absolute w-[350px] h-[350px] bg-purple-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* Container */}
      <div className="relative w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white">
            Help Center
          </h1>
          <p className="text-slate-400 mt-3">
            Find answers and support for your MLM system
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search help..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="text-white font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-sm text-slate-400"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* 📩 Support Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 text-center"
        >
          <Mail className="mx-auto mb-3 text-indigo-400" size={28} />

          <h3 className="text-white font-semibold text-lg">
            Still need help?
          </h3>

          <p className="text-slate-400 text-sm mt-1">
            Contact our support team anytime
          </p>

          <p className="text-indigo-400 mt-3 font-medium">
            support@aiwedia.com
          </p>
        </motion.div>

      </div>
    </section>
  );
}