"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I add funds to my wallet?",
    a: "Open Add Fund, submit your payment proof and amount, then wait for admin approval. Approved amount is credited to your wallet.",
  },
  {
    q: "Why can I not withdraw full wallet balance?",
    a: "Withdrawals are based on eligible amount, not full wallet balance. Check your eligible amount on wallet and payout pages before creating request.",
  },
  {
    q: "How does fund transfer work?",
    a: "Use recipient user ID, amount and optional note. Transfer is allowed only when your eligible amount is sufficient. Recipient gets the amount in eligible balance.",
  },
  {
    q: "What does community and side mean in team tree?",
    a: "Community is your global lane (left/right). Side is your local branch position under a parent node. Level shows depth in the tree.",
  },
  {
    q: "Where do I see income and payout status?",
    a: "Use Income Report for trade/sponsor/matching streams and Payout Summary for approved, pending and rejected withdrawal requests.",
  },
  {
    q: "How to find a user in team tree?",
    a: "Go to My Team > Member Tree and search by user ID. The focused context will show parent, direct downline and second-level downline.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen w-full px-6 py-20 flex justify-center overflow-hidden">

      {/* Background */}
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
            Common questions and platform usage guidance
          </p>
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

      </div>
    </section>
  );
}