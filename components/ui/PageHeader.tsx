"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;

  // optional features
  backHref?: string;
  breadcrumbs?: { label: string; href?: string }[];

  sticky?: boolean;
};

export default function PageHeader({
  title,
  subtitle,
  rightContent,
  backHref,
  breadcrumbs,
  sticky = false,
}: Props) {
  return (
    <div
      className={`
        w-full px-6 md:px-8 pt-6 pb-3
        ${sticky ? "sticky top-20 z-30 backdrop-blur-xl bg-[#060A14]/70" : ""}
      `}
    >
      {/* 🔹 Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}

              {index < breadcrumbs.length - 1 && (
                <span className="opacity-40">/</span>
              )}
            </div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        {/* 🔹 Left Section */}
        <div className="flex items-start gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="mt-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <ArrowLeft size={16} />
            </Link>
          )}

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 🔹 Right Section */}
        {rightContent && (
          <div className="flex items-center gap-3">
            {rightContent}
          </div>
        )}
      </motion.div>

      {/* 🔹 Divider */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}