"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { name: "Admin Home", href: "/admindashboard" },
  { name: "Fund Requests", href: "/admindashboard/fund-requests" },
  { name: "Withdrawals", href: "/admindashboard/withdrawals" },
  { name: "Holidays", href: "/admindashboard/holidays" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#060A14] text-slate-300 flex flex-col border-r border-white/5">
      <div className="px-5 py-5 border-b border-white/5">
        <span className="text-lg font-semibold text-white tracking-wide">Admin Panel</span>
      </div>
      <div className="p-4 space-y-2">
        {MENU.map((item) => {
          const active =
            item.href === "/admindashboard" ? pathname === "/admindashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg ${active ? "bg-indigo-600 text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
