"use client";

import Link from "next/link";
import SiteLogo from "@/components/brand/SiteLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const nav = [
    { label: "About", href: "/#about" },
    { label: "Features", href: "/#features" },
    { label: "Plans", href: "/#plans" },
    { label: "Team", href: "/#team" },
    { label: "Sign in", href: "/login" },
    { label: "Create account", href: "/register" },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a] text-gray-300">
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex flex-wrap items-center gap-3">
              <SiteLogo variant="footer" />
              <span className="text-xl font-bold text-white">
                UK <span className="text-blue-500">Trade</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Structured participation and clear reporting for members who expect both ambition and
              accountability.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Navigate</p>
            <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="tel:+919911122913" className="text-gray-400 transition hover:text-blue-400">
                  +91 99111 22913
                </a>
              </li>
              <li>
                <a href="mailto:info@uktrade.in" className="text-gray-400 transition hover:text-blue-400">
                  info@uktrade.in
                </a>
              </li>
            </ul>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-gray-500">
              181 Plot No 209 Basement RZ-209, Kh No 10/14, Nand Vihar Vill., Kakrola, New Delhi 110078
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          © {currentYear} UK Trade. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
