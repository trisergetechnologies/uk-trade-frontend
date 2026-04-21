"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header
      className="
        relative
        h-20 flex items-center justify-between px-8
        bg-[#0B0F19]/80
        backdrop-blur-xl
        border-b border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.6)]
        shrink-0
      "
    >
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 w-[300px] h-[200px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-0 top-0 w-[300px] h-[200px] bg-purple-500/10 blur-[100px]" />
      </div>

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Dashboard
        </h1>
        <span className="hidden md:block text-sm text-slate-400">
          Welcome back 👋
        </span>
      </div>

      {/* CENTER SEARCH */}
      <div
        className="
          hidden md:flex items-center
          w-[420px]
          bg-white/5
          border border-white/10
          px-4 py-2.5
          rounded-2xl
          transition-all duration-300
          focus-within:ring-2 focus-within:ring-blue-500/30
          focus-within:bg-white/10
        "
      >
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search dashboard..."
          className="
            bg-transparent outline-none ml-3 w-full text-sm
            text-white placeholder:text-slate-500
          "
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button
          className="
            relative p-3 rounded-2xl
            bg-white/5 border border-white/10
            hover:bg-white/10
            transition-all duration-300
            hover:scale-105
          "
        >
          <Bell size={20} className="text-slate-300" />
          <span
            className="
              absolute top-2 right-2
              w-2.5 h-2.5
              bg-red-500 rounded-full
              ring-2 ring-[#0B0F19]
            "
          />
        </button>

        {/* Divider */}
        <div className="hidden md:block h-8 w-px bg-white/10" />

        {/* Profile */}
        <button
          className="
            flex items-center gap-3
            px-3 py-2 rounded-2xl
            bg-white/5 border border-white/10
            hover:bg-white/10
            transition-all duration-300
            hover:scale-[1.02]
          "
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-10 h-10 rounded-full ring-2 ring-white/20"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-white">Admin</span>
            <span className="text-xs text-slate-400">Administrator</span>
          </div>
          <ChevronDown size={18} className="hidden md:block text-slate-400" />
        </button>
      </div>
    </header>
  );
}