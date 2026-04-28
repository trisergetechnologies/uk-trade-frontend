"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, LayoutDashboard, LineChart, Play } from "lucide-react";
import SiteLogo from "@/components/brand/SiteLogo";
import { StaggerItem, StaggerReveal } from "@/components/motion/Stagger";
import HeroBackdrop from "@/components/landing/HeroBackdrop";
import HeroVisual from "@/components/landing/HeroVisual";
import { useClientSession } from "@/hooks/useClientSession";

export default function LandingHero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { hydrated, isLoggedIn, dashboardPath } = useClientSession();

  const py1 = useTransform(scrollY, [0, 500], [0, 36]);
  const py2 = useTransform(scrollY, [0, 500], [0, -28]);
  const py3 = useTransform(scrollY, [0, 500], [0, 32]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />

        <div className="animate-gradient-x absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/45 to-transparent opacity-50" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-12 px-5 pt-24 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-20">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
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

        <div className="relative flex min-h-[280px] items-center justify-center lg:min-h-0">
          <HeroVisual reduceMotion={!!reduceMotion} />
        </div>
      </div>
    </section>
  );
}
