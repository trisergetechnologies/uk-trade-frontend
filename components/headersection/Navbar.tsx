"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import SiteLogo from "@/components/brand/SiteLogo";
import { useClientSession } from "@/hooks/useClientSession";

const NAV = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Plans", href: "/#plans" },
  { label: "Team", href: "/#team" },
] as const;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { hydrated, isLoggedIn, dashboardPath } = useClientSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center gap-2">
            <span className="relative rounded-lg ring-1 ring-white/10 transition group-hover:ring-purple-500/40">
              <SiteLogo variant="navbar" priority />
            </span>
            <span className="hidden text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent sm:inline">
              UK <span className="text-blue-500">Trade</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {hydrated && isLoggedIn ? (
              <Link
                href={dashboardPath}
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 transition hover:brightness-110 shadow-lg shadow-purple-500/25"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="relative px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 transition hover:brightness-110 shadow-lg shadow-purple-500/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/10"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
          >
            <Menu className="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 transform transition ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <span className="text-white font-bold text-lg">Menu</span>
          <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X className="text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {hydrated && isLoggedIn ? (
              <Link
                href={dashboardPath}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
