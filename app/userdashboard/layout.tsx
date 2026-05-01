"use client";

import Sidebar from "@/components/ui/Sidebar";
import DashboardNavbar from "@/components/ui/DashboardNavbar";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen bg-[#060A14] text-white overflow-hidden">

      <Sidebar className="hidden md:flex" />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar
        className={`fixed left-0 top-0 z-50 h-screen w-64 max-w-[85vw] transform transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full flex"
        }`}
        onNavigate={() => setMobileMenuOpen(false)}
      />

      {/* ✅ min-h-0 is the critical fix — allows flex child to shrink */}
      <div className="flex-1 flex flex-col min-h-0">

        <DashboardNavbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto px-3 py-4 md:px-8 md:py-8">
          {children}
        </main>

      </div>
    </div>
  );
}