"use client";

import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthMe, type AuthUser } from "@/lib/api";

export default function DashboardNavbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAuthMe();
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name?.trim() || "Account";
  const emailLine = user?.email || "User dashboard";
  const codeLine = user?.userCode ? `ID: ${user.userCode}` : "";

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
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 w-[300px] h-[200px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-0 top-0 w-[300px] h-[200px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white tracking-tight">Dashboard</h1>
        <span className="hidden md:block text-sm text-slate-400">Welcome back 👋</span>
      </div>

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

      <div className="flex items-center gap-5">
        <div className="hidden md:block h-8 w-px bg-white/10" />

        <div
          className="
            flex items-center gap-3
            px-3 py-2 rounded-2xl
            bg-white/5 border border-white/10
          "
        >
          <div className="w-10 h-10 rounded-full ring-2 ring-white/20 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.trim() ? user.name.trim().charAt(0).toUpperCase() : <User size={20} className="text-white" />}
          </div>
          <div className="hidden md:flex flex-col text-left min-w-0 max-w-[220px]">
            <span className="text-sm font-semibold text-white truncate">{displayName}</span>
            <span className="text-xs text-slate-400 truncate">{emailLine}</span>
            {codeLine && <span className="text-[11px] text-indigo-300 truncate">{codeLine}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
