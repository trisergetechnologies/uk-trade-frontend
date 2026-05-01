"use client";

import {
  LayoutDashboard,
  User,
  Wallet,
  ArrowRightLeft,
  Download,
  Users,
  BarChart3,
  HelpCircle,
  TrendingUp,
  Sparkles,
  FileText,
  Package,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEventHandler } from "react";

/* =========================
   TYPES (Reusable)
========================= */
type MenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

/* =========================
   CONFIG (EDIT HERE ONLY)
========================= */
const MENU: MenuSection[] = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", href: "/userdashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Profile", href: "/userdashboard/profile", icon: User },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { name: "Add Fund", href: "/userdashboard/add-fund", icon: Wallet },
      { name: "Package", href: "/userdashboard/package", icon: Package },
      { name: "Wallet ledger", href: "/userdashboard/wallet-ledger", icon: FileText },
      { name: "Withdraw", href: "/userdashboard/withdraw", icon: Download },
      { name: "Fund Transfer", href: "/userdashboard/fund-transfer", icon: ArrowRightLeft },
    ],
  },
  {
    title: "TEAM",
    items: [
      { name: "My Team", href: "/userdashboard/team", icon: Users },
    ],
  },
  {
    title: "INCOME",
    items: [
      { name: "Income Report", href: "/userdashboard/income", icon: BarChart3 },
      { name: "Payout Summary", href: "/userdashboard/payout", icon: TrendingUp },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Help Center", href: "/userdashboard/help", icon: HelpCircle },
    ],
  },
];

/* =========================
   ACTIVE ROUTE LOGIC
========================= */
const useActiveRoute = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // strict match for root dashboard
    if (href === "/userdashboard") {
      return pathname === href;
    }

    // child routes
    return pathname.startsWith(href);
  };

  return { isActive };
};

/* =========================
   COMPONENT
========================= */
type SidebarProps = {
  className?: string;
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
};

export default function Sidebar({ className = "", onNavigate }: SidebarProps) {
  const { isActive } = useActiveRoute();

  return (
    <aside className={`flex w-64 h-screen bg-[#060A14] text-slate-300 flex-col border-r border-white/5 ${className}`}>

      {/* ---------- LOGO ---------- */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-wide">
            UK Trade
          </span>
        </div>
      </div>

      {/* ---------- MENU ---------- */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {MENU.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] text-slate-500 px-3 mb-2 tracking-widest">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-300
                      
                      ${
                        active
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    {/* LEFT INDICATOR */}
                    <div
                      className={`absolute left-0 top-0 h-full w-[3px] rounded-r transition-all duration-300
                        ${
                          active
                            ? "bg-indigo-400"
                            : "bg-transparent group-hover:bg-white/20"
                        }
                      `}
                    />

                    {/* ICON */}
                    <item.icon
                      size={17}
                      className={`transition-all duration-300
                        ${
                          active
                            ? "text-white"
                            : "text-slate-500 group-hover:text-indigo-400"
                        }
                      `}
                    />

                    {/* TEXT */}
                    <span className="flex-1">{item.name}</span>

                    {/* ACTIVE DOT */}
                    {active && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition">
          Logout
        </button>
      </div>
    </aside>
  );
}