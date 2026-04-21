"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  Users,
  Award,
  Gift,
  LogIn,
  Sparkles,
  BarChart3,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              MLM<span className="text-blue-500">Pro</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-2">

            {/* FEATURES */}
            <div
              className="relative"
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition">
                Features
                <ChevronDown
                  className={`w-4 h-4 transition ${
                    isFeaturesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFeaturesOpen && (
                <div className="absolute left-0 mt-3 w-80 bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                  {[
                    { icon: TrendingUp, title: "Commission Tracker", desc: "Track earnings live" },
                    { icon: Users, title: "Team Management", desc: "Manage your network" },
                    { icon: Award, title: "Rank System", desc: "Gamified progress" },
                    { icon: Gift, title: "Bonuses", desc: "Rewards & incentives" },
                    { icon: BarChart3, title: "Analytics", desc: "Advanced dashboard" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition"
                    >
                      <item.icon className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {["Pricing", "Success", "Resources", "Help"].map((item) => (
              <Link
                key={item}
                href="#"
                className="px-4 py-2 text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="#"
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>

            <Link
              href="#"
              className="relative px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition shadow-lg shadow-purple-500/20"
            >
              Get Started
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/10"
          >
            <Menu className="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 transform transition ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <span className="text-white font-bold text-lg">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {["Features", "Pricing", "Success", "Resources", "Help"].map((item) => (
            <Link
              key={item}
              href="#"
              className="block text-gray-300 hover:text-white transition"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;