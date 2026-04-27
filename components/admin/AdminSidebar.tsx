"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Coins,
  LayoutDashboard,
  LogOut,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { clearAuthToken } from "@/lib/session";

const MENU = [
  { name: "Overview", href: "/admindashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admindashboard/users", icon: Users },
  { name: "Plans & Packages", href: "/admindashboard/catalog", icon: Coins },
  { name: "Fund Requests", href: "/admindashboard/fund-requests", icon: Wallet },
  { name: "Withdrawals", href: "/admindashboard/withdrawals", icon: ShieldCheck },
  { name: "Holidays", href: "/admindashboard/holidays", icon: CalendarDays },
  { name: "General Settings", href: "/admindashboard/settings", icon: Settings2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAuthToken();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-[#070c19] to-[#060A14] text-slate-300 flex flex-col border-r border-white/10">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30">
            <ShieldCheck size={20} className="text-indigo-300" />
          </span>
          <div>
            <p className="text-base font-semibold text-white tracking-wide">UK Trade Admin</p>
            <p className="text-xs text-slate-500">Platform control center</p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {MENU.map((item) => {
          const active =
            item.href === "/admindashboard" ? pathname === "/admindashboard" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border transition ${
                active
                  ? "bg-indigo-600/20 border-indigo-500/40 text-white"
                  : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06] hover:border-white/15"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} className={active ? "text-indigo-200" : "text-slate-400 group-hover:text-slate-200"} />
                <span className="text-sm">{item.name}</span>
              </span>
              {active ? <ChevronRight size={14} className="text-indigo-200" /> : <ChevronLeft size={14} className="rotate-180 text-slate-600 group-hover:text-slate-400" />}
            </Link>
          );
        })}
        </nav>

      <div className="shrink-0 p-4 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => logout()}
          className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-sm text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
        >
          <span className="flex items-center gap-2.5">
            <LogOut size={16} className="text-slate-400 group-hover:text-red-300" />
            Log out
          </span>
          <ChevronRight size={14} className="rotate-180 text-slate-600 opacity-80 group-hover:text-red-300" />
        </button>
      </div>
    </div>
    </aside>
  );
}
