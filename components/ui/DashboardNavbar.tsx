"use client";

import { Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthMe, type AuthUser } from "@/lib/api";

type DashboardNavbarProps = {
  onMenuClick?: () => void;
};

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
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
  const codeLine = user?.role === "admin" ? "" : user?.userCode ? `ID: ${user.userCode}` : "";

  return (
    <header
      className="
        relative
        min-h-20 flex items-center justify-between px-3 py-3 md:h-20 md:px-8
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

      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white md:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-semibold text-white tracking-tight">Dashboard</h1>
        <span className="hidden md:block text-sm text-slate-400">Welcome back 👋</span>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden md:block h-8 w-px bg-white/10" />

        <div
          className="
            flex items-center gap-3
            px-2 py-2 md:px-3 rounded-2xl
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
