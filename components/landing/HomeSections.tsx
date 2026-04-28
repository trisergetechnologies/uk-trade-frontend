"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Headphones,
  LayoutGrid,
  Shield,
  Wallet,
  Zap,
  Globe2,
  Lock,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useClientSession } from "@/hooks/useClientSession";

const springView = {
  type: "spring" as const,
  damping: 26,
  stiffness: 200,
};

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px", amount: 0.12 },
  transition: springView,
};

const lineReveal = {
  initial: { scaleX: 0, opacity: 0 },
  whileInView: { scaleX: 1, opacity: 1 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const features = [
  {
    title: "Modular trading flows",
    desc: "Step-through tools that mirror how plans actually run—so daily rhythm, qualifications, and payouts stay easy to follow.",
    icon: LayoutGrid,
  },
  {
    title: "People-first guidance",
    desc: "Orientation and updates designed to reduce noise: what changed, what matters, and what to do next.",
    icon: Headphones,
  },
  {
    title: "One workspace",
    desc: "Funding, recognition buckets, and history live together—fewer tabs, fewer spreadsheets on the side.",
    icon: BarChart3,
  },
];

const plans = [
  {
    id: "trade",
    title: "Trade income",
    subtitle: "Daily window",
    bullets: [
      "Daily accrual aligned to your plan schedule",
      "Runs across the published day cap (often up to 200 eligible days)",
      "Calendar rhythm follows official programme docs—not informal hearsay",
    ],
    accent: "from-yellow-400/95 via-purple-600 to-indigo-600",
  },
  {
    id: "sponsor",
    title: "Sponsor income",
    subtitle: "Referral recognition",
    bullets: [
      "Share of qualifying volume attributed to introductions you verified",
      "Transparent uplines where the programme allows visibility",
      "Accrual tied to real activity—not cosmetic invites",
    ],
    accent: "from-purple-400 to-blue-600",
  },
  {
    id: "matching",
    title: "Matching income",
    subtitle: "Balanced pairs",
    bullets: [
      "Reward when paired business volume meets published thresholds",
      "Encourages symmetry rather than one-sided spikes",
      "Eligibility and caps defined in your agreement—not generic slides",
    ],
    accent: "from-pink-500 to-violet-700",
  },
];

const benefits = [
  { label: "Reach from anywhere", icon: Globe2 },
  { label: "Records you can audit", icon: Lock },
  { label: "Smooth onboarding", icon: Zap },
  { label: "Safety-minded defaults", icon: Shield },
  { label: "Early loyalty perks", icon: Wallet },
  { label: "Several reward lanes", icon: BarChart3 },
];

const leaders = [
  {
    name: "Naveen Chandra Tiwari",
    role: "Managing Director & CEO",
    src: "/naveen.jpg",
  },
  {
    name: "Lakhan Singh Saini",
    role: "Chief Executive Officer & Founder",
    src: "/lakhan.jpg",
  },
  {
    name: "Rajender Singh",
    role: "Chief Executive Officer & Founder",
    src: "/rajendra.jpeg",
  },
];

export default function HomeSections() {
  const reduceMotion = useReducedMotion();
  const { hydrated, isLoggedIn, dashboardPath } = useClientSession();

  const hoverLift = reduceMotion
    ? {}
    : { y: -3, transition: { type: "spring" as const, stiffness: 400, damping: 28 } };

  const dashboardHref = hydrated && isLoggedIn ? dashboardPath : "/login";

  return (
    <>
      <section id="about" className="relative scroll-mt-24 bg-[#050505] py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/45 via-transparent to-transparent" />
        <div className="pointer-events-none absolute right-[8%] top-24 h-48 w-48 rounded-full bg-purple-600/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-32 left-[5%] h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div
            className="mb-4 h-1 w-16 origin-left rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            {...lineReveal}
          />
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400/95">
              Who we are
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Clarity-first participation—not noise-first marketing
            </h2>
            <p className="mt-6 max-w-3xl text-pretty text-slate-400 leading-relaxed">
              UK Trade brings together diversified market participation under one disciplined operating
              model. Returns flow back to members through published dividend and bonus mechanics—always
              tied to documentation you can read, not promises you cannot verify. We favour sober
              execution, visible reporting, and systems that still make sense months after you join.
            </p>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ ...springView, delay: 0.08 }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                stat: "Grounded leadership",
                detail:
                  "Operators who understand compliance pressure, member trust, and what breaks when shortcuts creep in.",
              },
              {
                stat: "Measured growth",
                detail:
                  "Year-on-year lift in automation, transparency, and how quickly members find answers.",
              },
              {
                stat: "Answers on tap",
                detail:
                  "Dashboards that answer ‘what happened / why / what’s next’ without chasing support threads.",
              },
            ].map((item) => (
              <motion.div
                key={item.stat}
                whileHover={hoverLift}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-purple-500/35 hover:bg-white/[0.05]"
              >
                <p className="text-lg font-medium text-white">{item.stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-y border-white/10 bg-[#070a12] py-20 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div {...fade} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400/95">
              Platform depth
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built to stay understandable as you scale
            </h2>
            <p className="mt-4 text-slate-400">
              Interfaces that privilege signal over spectacle—so both newcomers and power users land in
              the right workflow fast.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.article
                key={f.title}
                {...fade}
                transition={{ ...springView, delay: i * 0.07 }}
                whileHover={hoverLift}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-colors hover:border-purple-500/45 hover:shadow-[0_24px_55px_-22px_rgba(168,85,247,0.38)]"
              >
                <div className="inline-flex rounded-xl bg-purple-500/15 p-3 text-purple-300 ring-1 ring-purple-500/25 transition group-hover:bg-purple-500/25">
                  <f.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20">
        <div className="absolute inset-y-0 right-0 w-1/2 max-lg:hidden bg-[radial-gradient(circle_at_right,_rgba(168,85,247,0.16),transparent_66%)]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-56 w-56 rounded-full bg-indigo-600/08 blur-[72px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Execution rails
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Fund, track, reconcile—without juggling five different apps
            </h2>
            <p className="mt-5 text-pretty text-slate-400 leading-relaxed">
              Where channels allow, lean on bank transfers, UPI, or cards—then watch allocations,
              instruments, and programme milestones surface in the same workspace you already trust for
              rewards.
            </p>
          </motion.div>
          <motion.div
            {...fade}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
          >
            <ul className="space-y-4 text-sm text-slate-300">
              {[
                "Wallet + ledger views that reconcile at a glance",
                "Requests carry timestamps—status never feels mythical",
                "Income lanes labelled the same way your statements think about them",
              ].map((line, idx) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, ...springView }}
                  className="flex gap-3"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  {line}
                </motion.li>
              ))}
            </ul>
            <Link
              href={dashboardHref}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
            >
              {hydrated && isLoggedIn ? (
                <>
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Open dashboard
                </>
              ) : (
                "Open dashboard"
              )}
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-24 bg-[#070a12] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400/95">
              Reward architecture
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Three familiar pillars—spelled out in plain language
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              Numbers below are directional summaries. Caps, calendars, and eligibility live in your
              formal plan pack—always defer there when in doubt.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <motion.article
                key={p.id}
                {...fade}
                transition={{ ...springView, delay: i * 0.08 }}
                whileHover={hoverLift}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#050505] p-6 sm:p-7 transition-shadow hover:shadow-[0_28px_65px_-30px_rgba(99,102,241,0.5)]"
              >
                <div
                  className={`inline-flex w-fit rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white ${p.accent}`}
                >
                  {p.subtitle}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{p.title}</h3>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-400">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-purple-400">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050505] py-20 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <div className="pointer-events-none absolute left-1/2 top-0 h-36 w-[min(90%,480px)] -translate-x-1/2 rounded-full bg-purple-600/08 blur-[60px]" />
          <motion.div {...fade} className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400/95">
              Why members stay
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Practical advantages etched into the product
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                {...fade}
                transition={{ ...springView, delay: i * 0.045 }}
                whileHover={hoverLift}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-blue-500/35"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/25 to-blue-600/25 text-blue-200 ring-1 ring-white/10">
                  <b.icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="font-medium text-slate-200">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="scroll-mt-24 bg-[#070a12] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Leadership
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The team steering execution
            </h2>
            <p className="mt-4 text-slate-400">
              Faces behind the operating cadence—available here so you know who carries accountability.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((person, i) => (
              <motion.article
                key={person.name}
                {...fade}
                transition={{ ...springView, delay: i * 0.07 }}
                whileHover={hoverLift}
                className="group rounded-2xl border border-white/10 bg-[#050505] p-5 text-center transition-shadow hover:shadow-[0_24px_55px_-28px_rgba(147,51,234,0.38)] sm:p-6"
              >
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl ring-2 ring-purple-500/35 ring-offset-2 ring-offset-[#050505]">
                  <Image
                    src={person.src}
                    alt={person.name}
                    fill
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent opacity-80" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{person.name}</h3>
                <p className="mt-1 text-sm text-blue-300/95">{person.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gradient-to-b from-[#050505] to-[#070a12] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <motion.div {...fade}>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {hydrated && isLoggedIn ? "Pick up where you left off" : "See the platform for yourself"}
            </h2>
            <p className="mt-3 text-slate-400">
              {hydrated && isLoggedIn
                ? "Your live balances, requests, and recognition trails are one tap away."
                : "Create an account to explore the workspace—or sign in if you are already with us."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {hydrated && isLoggedIn ? (
                <Link
                  href={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-110"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-110"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex rounded-xl border border-white/15 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
