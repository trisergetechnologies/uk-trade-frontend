"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, LayoutDashboard, LineChart, Play } from "lucide-react";
import SiteLogo from "@/components/brand/SiteLogo";
import { StaggerItem, StaggerReveal } from "@/components/motion/Stagger";
import HeroBackdrop from "@/components/landing/HeroBackdrop";
import HeroVisual from "@/components/landing/HeroVisual";
import { useClientSession } from "@/hooks/useClientSession";

// Pre-computed positions to avoid hydration mismatch (no Math.random)
const PARTICLES = [
  { x: 5,  y: 8,  s: 1.5, dur: 7,  dy: -14, delay: 0   },
  { x: 14, y: 35, s: 1,   dur: 9,  dy: 11,  delay: 1.5 },
  { x: 22, y: 62, s: 2,   dur: 11, dy: -9,  delay: 0.8 },
  { x: 8,  y: 80, s: 1.5, dur: 8,  dy: 13,  delay: 2.1 },
  { x: 32, y: 15, s: 1,   dur: 10, dy: -11, delay: 1.2 },
  { x: 38, y: 72, s: 1.5, dur: 7,  dy: 9,   delay: 3.0 },
  { x: 48, y: 42, s: 1,   dur: 9,  dy: -15, delay: 0.5 },
  { x: 55, y: 88, s: 2,   dur: 12, dy: 11,  delay: 2.5 },
  { x: 65, y: 12, s: 1.5, dur: 8,  dy: -13, delay: 1.8 },
  { x: 72, y: 55, s: 1,   dur: 11, dy: 9,   delay: 0.3 },
  { x: 78, y: 28, s: 2,   dur: 9,  dy: -11, delay: 2.8 },
  { x: 85, y: 68, s: 1,   dur: 7,  dy: 13,  delay: 1.1 },
  { x: 92, y: 42, s: 1.5, dur: 10, dy: -9,  delay: 3.5 },
  { x: 18, y: 50, s: 1,   dur: 8,  dy: 11,  delay: 0.7 },
  { x: 45, y: 20, s: 2,   dur: 12, dy: -13, delay: 2.2 },
  { x: 60, y: 75, s: 1.5, dur: 7,  dy: 9,   delay: 1.6 },
  { x: 28, y: 90, s: 1,   dur: 9,  dy: -11, delay: 3.2 },
  { x: 82, y: 15, s: 2,   dur: 11, dy: 13,  delay: 0.4 },
  { x: 10, y: 25, s: 1,   dur: 8,  dy: -8,  delay: 2.6 },
  { x: 50, y: 60, s: 1.5, dur: 10, dy: 10,  delay: 0.9 },
] as const;

const SECTION_ORBS = [
  { x: 8, y: 18, size: 10, dur: 17, dx: 24, dy: -18, delay: 0.4 },
  { x: 24, y: 72, size: 8, dur: 15, dx: -18, dy: 20, delay: 1.2 },
  { x: 46, y: 14, size: 9, dur: 19, dx: 16, dy: 14, delay: 0.9 },
  { x: 70, y: 30, size: 11, dur: 16, dx: -22, dy: -10, delay: 2.2 },
  { x: 88, y: 64, size: 9, dur: 18, dx: 20, dy: 12, delay: 1.7 },
  { x: 58, y: 88, size: 8, dur: 14, dx: -14, dy: -16, delay: 2.8 },
] as const;

export default function LandingHero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { hydrated, isLoggedIn, dashboardPath } = useClientSession();

  const py1 = useTransform(scrollY, [0, 500], [0, 36]);
  const py2 = useTransform(scrollY, [0, 500], [0, -28]);
  const py3 = useTransform(scrollY, [0, 500], [0, 32]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#050505] text-white">

      {/* ── LAYER 0 — ambient backdrop ── */}
      <div className="pointer-events-none absolute inset-0">
        <HeroBackdrop reduceMotion={!!reduceMotion} />

        <motion.div
          style={{ y: reduceMotion ? 0 : py1 }}
          className="absolute -left-[18%] top-[-8%] h-[50vmin] w-[50vmin] rounded-full bg-purple-600/22 blur-[90px] animate-hero-blob"
        />
        <motion.div
          style={{ y: reduceMotion ? 0 : py2, animationDelay: "-6s" }}
          className="absolute -right-[12%] top-[18%] h-[46vmin] w-[46vmin] rounded-full bg-blue-600/18 blur-[100px] animate-hero-blob"
        />
        <motion.div
          style={{ y: reduceMotion ? 0 : py3, animationDelay: "-12s" }}
          className="absolute bottom-[-12%] left-[18%] h-[42vmin] w-[42vmin] rounded-full bg-indigo-600/18 blur-[85px] animate-hero-blob"
        />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
        <div className="animate-gradient-x absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/45 to-transparent opacity-50" />
      </div>

      {/* ── LAYER 1 — floating particles across the whole section ── */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {SECTION_ORBS.map((p, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full bg-purple-300/35 blur-[2px]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                boxShadow: "0 0 26px rgba(167,139,250,0.35)",
              }}
              animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [0.28, 0.75, 0.28] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-200"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.s * 2}px`,
                height: `${p.s * 2}px`,
              }}
              animate={{ y: [0, p.dy, 0], opacity: [0.2, 0.65, 0.2] }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* ── LAYER 2 — full-viewport-height orbital (desktop right side) ── */}
      {/* This is what was wrong before — the visual was capped at 420px in a grid cell.
          Now it's absolutely positioned and fills the entire right 56% of the viewport height. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:flex items-center justify-center">
        <HeroVisual reduceMotion={!!reduceMotion} />
      </div>

      {/* ── LAYER 3 — directional gradient so text stays readable over the orbital ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #050505 26%, rgba(5,5,5,0.9) 44%, rgba(5,5,5,0.35) 64%, transparent 82%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent" />

      {/* ── LAYER 4 — text content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pt-24 pb-20 sm:px-6">
        <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-[540px] lg:text-left">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex justify-center lg:justify-start"
          >
            <SiteLogo variant="hero" priority />
          </motion.div>

          <StaggerReveal className="space-y-0">
            <StaggerItem>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-purple-200/95 sm:text-sm">
                <LineChart className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                Trade · Transparency · Together
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.15rem]">
                Step into{" "}
                <span className="bg-gradient-to-r from-purple-200 via-fuchsia-200 to-blue-400 bg-clip-text text-transparent">
                  UK Trade
                </span>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-3 text-lg text-slate-300 sm:text-xl">
                Where ambitious members meet disciplined execution
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-6 text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
                Clear programmes, honest reporting, and a workspace that keeps your progress
                visible—whether you are just starting out or scaling with your team.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex min-h-[52px] flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                {!hydrated ? (
                  <div className="flex flex-wrap gap-3">
                    <div className="h-11 flex-1 rounded-xl bg-white/5 sm:max-w-[11rem]" aria-hidden />
                    <div className="h-11 flex-1 rounded-xl bg-white/5 sm:max-w-[9rem]" aria-hidden />
                  </div>
                ) : isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardPath}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden />
                      Go to dashboard
                    </Link>
                    <Link
                      href="#plans"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                    >
                      View plans
                    </Link>
                    <a
                      href="#about"
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20">
                        <Play className="h-3.5 w-3.5 fill-current opacity-70" aria-hidden />
                      </span>
                      Why us
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
                    >
                      Join now
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                    >
                      Login
                    </Link>
                    <a
                      href="#plans"
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20">
                        <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
                      </span>
                      Explore plans
                    </a>
                  </>
                )}
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </div>

      {/* ── Mobile: visual stacked below text ── */}
      <div className="relative z-10 flex h-[360px] w-full items-center justify-center pb-12 lg:hidden">
        <HeroVisual reduceMotion={!!reduceMotion} />
      </div>
    </section>
  );
}
