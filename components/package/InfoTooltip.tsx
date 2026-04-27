"use client";

import { Info } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  /** For screen readers, e.g. "Why we use packages" */
  label: string;
  children: string;
  className?: string;
};

/**
 * Click/tap/focus to toggle details (works on mobile; not hover-only).
 */
export function InfoTooltip({ label, children, className = "" }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        aria-describedby={open ? id : undefined}
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Info className="w-4 h-4 shrink-0" />
      </button>
      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-1.5 w-[min(100vw-2rem,20rem)] sm:w-80 p-3 rounded-2xl border border-white/10 bg-[#0c1220] text-slate-300 text-xs leading-relaxed shadow-2xl"
        >
          {children}
        </div>
      )}
    </div>
  );
}
