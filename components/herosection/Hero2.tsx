"use client";

import { ArrowRight, TrendingUp, Users, Rocket } from "lucide-react";

export default function Hero3() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center">

      {/* 🔥 Glow Background */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/20 blur-[180px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-yellow-500/10 blur-[180px]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#ffffff10_1px,transparent_1px),linear-gradient(90deg,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 text-center">

        {/* HEADING */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="text-white">Scale Your</span>
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
            MLM Income System
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
          Track your earnings, grow your downline, and unlock new ranks —
          all from one powerful automated platform.
        </p>

       

        {/* STATS */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { value: "₹2Cr+", label: "Total Earnings" },
            { value: "25K+", label: "Active Members" },
            { value: "120%", label: "Growth Rate" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
              <p className="text-sm text-gray-400">MLM Dashboard</p>
              <span className="text-xs text-green-400">LIVE</span>
            </div>

            {/* CONTENT */}
            <div className="p-6 grid md:grid-cols-2 gap-6">

              {/* LEFT - NETWORK */}
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Users className="w-5 h-5 text-purple-400" />
                  Network Growth
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>You</span>
                    <span className="text-yellow-400">₹2,340</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Level 1</span>
                    <span>+₹1,120</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Level 2</span>
                    <span>+₹890</span>
                  </div>
                </div>
              </div>

              {/* RIGHT - EARNINGS */}
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Earnings Trend
                </div>

                <div className="flex items-end gap-2 h-28">
                  {[40, 60, 50, 80, 70, 90, 110].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-yellow-400 to-purple-500 rounded-t-md"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* BOTTOM */}
            <div className="p-4 border-t border-white/10 text-center text-sm text-gray-400">
              🚀 Unlock next rank to boost commissions
            </div>

          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center">
            <div className="w-1 h-2 bg-white/40 rounded-full mt-2" />
          </div>
        </div>

      </div>
    </section>
  );
}