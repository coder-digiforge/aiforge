import {
  ArrowDown,
  ArrowRight,
  Check,
  Code2,
  Image as ImageIcon,
  Megaphone,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import Link from "next/link";
import { generators } from "@/config/generators";
import HeroBanner from "@/components/landing/hero-banner";

// Bust any stale CDN error responses for /
export const dynamic = "force-dynamic";
export const revalidate = 0;

const steps = [
  {
    n: "01",
    title: "Describe your goal",
    text: "Pick a generator and write a clear prompt. Templates and placeholders guide you.",
  },
  {
    n: "02",
    title: "Generate with AI",
    text: "Server-side AI turns your prompt into drafts, visuals, code or campaigns in seconds.",
  },
  {
    n: "03",
    title: "Refine and ship",
    text: "Copy results, revisit history, and iterate until the output is ready to publish.",
  },
];

const workspaceTools = [
  { icon: WandSparkles, name: "AI Writer", color: "text-violet-300" },
  { icon: ImageIcon, name: "Image Generator", color: "text-blue-300" },
  { icon: Code2, name: "Code Assistant", color: "text-cyan-300" },
  { icon: Megaphone, name: "Marketing AI", color: "text-pink-300" },
];

const landingIconClasses: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-300",
  pink: "bg-pink-500/15 text-pink-300",
  blue: "bg-blue-500/15 text-blue-300",
  green: "bg-green-500/15 text-green-300",
  orange: "bg-orange-500/15 text-orange-300",
  cyan: "bg-cyan-500/15 text-cyan-300",
  indigo: "bg-indigo-500/15 text-indigo-300",
};

function landingIconClass(color: string): string {
  return landingIconClasses[color] ?? landingIconClasses.violet!;
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: ["120 starter credits", "All 7 generators", "Generation history", "Demo & live AI modes"],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Creator",
    price: "$19",
    period: "/mo",
    highlight: true,
    features: ["1,000 credits / month", "Priority generation", "Commercial use", "Email support"],
    cta: "Choose Creator",
    href: "/register",
  },
  {
    name: "Business",
    price: "$49",
    period: "/mo",
    highlight: false,
    features: ["5,000 credits / month", "Higher usage limits", "Admin controls", "Priority support"],
    cta: "Choose Business",
    href: "/register",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080910] text-white">
      {/* Background atmosphere effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[5%] h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[150px]" />
        <div className="absolute left-[10%] top-[35%] h-[300px] w-[300px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] h-[300px] w-[300px] rounded-full bg-purple-600/[0.05] blur-[120px]" />
      </div>

      {/* Fixed transparent Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#080910]/85 backdrop-blur-sm lg:bg-[#080910]/10 lg:backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <nav className="flex h-14 items-center justify-between gap-2 sm:h-16 lg:h-[84px]">
            <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] sm:h-10 sm:w-10 sm:rounded-xl">
                <Sparkles size={18} className="sm:hidden" />
                <Sparkles size={22} className="hidden sm:block" />
              </span>
              <span className="truncate text-lg font-bold tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(167,139,250,0.8)] sm:text-[23px]">
                AI<span className="text-violet-400">Forge</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {[
                { name: "AI Tools", href: "#tools" },
                { name: "How it works", href: "#how-it-works" },
                { name: "Pricing", href: "#pricing" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-violet-500/[0.10] hover:text-white lg:px-4"
                >
                  {item.name}
                  <span className="absolute bottom-0.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 shadow-[0_0_10px_rgba(167,139,250,0.9)] transition-all duration-300 group-hover:w-[65%]" />
                </a>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Link
                href="/login"
                className="inline-flex h-9 items-center whitespace-nowrap rounded-lg px-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-violet-500/[0.12] hover:text-white sm:h-11 sm:px-3"
              >
                Sign in
              </Link>

              <Link
                href="/dashboard"
                className="group relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-3 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.65)] sm:h-11 sm:gap-2 sm:px-5"
              >
                <span className="relative z-10 sm:hidden">Open</span>
                <span className="relative z-10 hidden sm:inline">Open workspace</span>
                <ArrowRight
                  size={16}
                  className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
                <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0 group-active:translate-x-0" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden pt-20 pb-14 sm:pt-24 sm:pb-16 lg:min-h-[85vh] lg:pt-28 lg:pb-24">
        {/* Background dark gradients */}
        <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[#080910]/90 via-[#080910]/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Content Column — centered on mobile/tablet */}
            <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
              {/* Badge */}
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/25 bg-[#11101e]/65 px-3 py-2 text-[9px] font-bold leading-none tracking-[0.12em] text-violet-300 sm:mb-7 sm:gap-2.5 sm:px-4 sm:text-xs sm:tracking-[0.14em]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
                <span className="truncate">THE AI WORKSPACE BUILT FOR YOUR NEXT BIG IDEA</span>
              </div>

              {/* Main heading */}
              <h1 className="max-w-[760px] text-[clamp(40px,5vw,68px)] font-bold leading-[1.08] tracking-[-0.045em]">
                Turn ideas into{" "}
                <span className="block sm:inline">extraordinary results.</span>{" "}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Create faster with AI.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 max-w-[520px] text-base leading-7 text-slate-300 md:text-lg">
                Generate high-end code, stunning graphics, marketing campaigns, and content in seconds using next-generation AI generators.
              </p>

              {/* Actions */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href="/register"
                  className="group relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.65)] sm:px-7"
                >
                  <Sparkles size={18} className="relative z-10 shrink-0 text-violet-200" />
                  <span className="relative z-10">Start Free — 120 credits</span>
                  <ArrowRight
                    size={17}
                    className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  />
                  <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
                </Link>

                <a
                  href="#tools"
                  className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] sm:px-7"
                >
                  <span className="relative z-10">Explore tools</span>
                  <ArrowDown size={15} className="relative z-10 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-y-0.5" />
                  <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-300 lg:justify-start">
                <div className="inline-flex items-center gap-2">
                  <span className="relative inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]" />
                  </span>
                  <span>99.9% uptime</span>
                </div>
                <span className="hidden text-slate-600 sm:inline" aria-hidden="true">•</span>
                <span>GDPR compliant</span>
                <span className="hidden text-slate-600 sm:inline" aria-hidden="true">•</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            <HeroBanner />

          </div>
        </div>
      </section>

      {/* Workspace Preview */}
      <section className="relative z-10 mx-auto max-w-[1120px] px-4 pb-16 sm:px-5 sm:pb-24">
        <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[#10111c] shadow-[0_-20px_100px_rgba(124,58,237,0.10)] sm:rounded-t-[22px]">
          <div className="flex h-10 items-center justify-between border-b border-white/[0.07] px-3 sm:px-4">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-500">AIForge / Workspace</span>
            <span className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems ready
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 sm:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready
            </span>
          </div>

          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[220px_1fr] md:p-8">
            <aside className="rounded-xl border border-white/[0.07] bg-[#0b0c14] p-4">
              <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold md:mb-5 md:justify-start">
                <Sparkles size={16} className="text-violet-400" />
                Your workspace
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-0 md:gap-2">
                {workspaceTools.map((tool) => (
                  <Link
                    key={tool.name}
                    href="/register"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-xs text-slate-400 transition-all duration-300 hover:bg-violet-500/[0.08] hover:text-violet-200 hover:shadow-[0_0_18px_rgba(139,92,246,0.10)] active:bg-violet-500/[0.12] active:text-violet-100"
                  >
                    <tool.icon size={16} className={`shrink-0 ${tool.color}`} />
                    <span className="leading-snug">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </aside>

            <div className="flex min-h-[200px] flex-col justify-between rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#171526] to-[#0d101a] p-5 text-center sm:min-h-[230px] sm:p-6 md:p-8 md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-violet-300">
                  <Sparkles size={14} />
                  AI CREATION STUDIO
                </div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
                  What will you create today?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Bring your ideas to life with powerful AI tools, all in one place.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 sm:mt-8 sm:px-4">
                <span className="min-w-0 truncate text-left text-xs text-slate-500">
                  Describe what you want to create...
                </span>
                <Link
                  href="/register"
                  aria-label="Start creating"
                  className="group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_18px_rgba(139,92,246,0.3)] transition-all active:scale-95 hover:scale-105"
                >
                  <ArrowRight size={17} className="relative z-10" />
                  <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative z-10 mx-auto max-w-[1120px] scroll-mt-24 px-6 py-20">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-violet-400">AI TOOLS</span>
          <h2 className="mt-3 text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
            Seven generators.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              One workspace.
            </span>
          </h2>
          <p className="mt-4 text-slate-400">
            From long-form writing to product visuals — switch tools without leaving your flow.
          </p>
        </div>

        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generators.map(({ id, name, description, icon: Icon, color, category, cost }) => (
            <Link
              key={id}
              href="/register"
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#10111c]/80 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${landingIconClass(color)}`}
                >
                  <Icon size={22} />
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] leading-none text-slate-400">
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-snug">{name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-violet-300 transition-all group-hover:text-violet-200">
                <Zap size={13} className="shrink-0" />
                <span>
                  {cost} credit{cost > 1 ? "s" : ""} per run
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}

          <div className="flex min-h-full flex-col justify-between rounded-2xl border border-dashed border-violet-400/30 bg-violet-500/[0.06] p-6">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Sparkles size={22} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">Ready when you are</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create a free workspace and get 120 credits instantly — no card required.
              </p>
            </div>
            <Link
              href="/register"
              className="group relative mt-6 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.65)] sm:w-auto"
            >
              <span className="relative z-10">Get started</span>
              <ArrowRight size={16} className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 scroll-mt-24 border-y border-white/[0.06] bg-[#0a0b12]/80 py-20"
      >
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-400">
              HOW IT WORKS
            </span>
            <h2 className="mt-3 text-[clamp(32px,4vw,48px)] font-bold tracking-tight">
              From prompt to publish in{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                three steps
              </span>
            </h2>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <div key={step.n} className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#10111c] p-7">
                <span className="text-sm font-bold tracking-[0.2em] text-violet-400">{step.n}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-[1120px] scroll-mt-24 px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-violet-400">PRICING</span>
          <h2 className="mt-3 text-[clamp(32px,4vw,48px)] font-bold tracking-tight">
            Simple plans that{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              scale with you
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-slate-400">
            Start free. Upgrade when your ideas need more power. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto grid max-w-md items-stretch gap-5 md:max-w-none md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col items-center rounded-2xl border p-7 text-center transition-all duration-300 ${
                tier.highlight
                  ? "border-violet-400/50 bg-gradient-to-b from-violet-500/[0.14] to-[#10111c] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                  : "border-white/10 bg-[#10111c]"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-1 text-[10px] font-bold leading-none tracking-wider">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                <span className="text-sm text-slate-400">{tier.period}</span>
              </div>
              <ul className="mt-6 flex w-full flex-1 flex-col items-center space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center justify-center gap-2.5 text-sm leading-5 text-slate-300">
                    <Check size={15} className="shrink-0 text-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`group relative mt-8 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                  tier.highlight
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.65)]"
                    : "border border-white/15 bg-white/[0.04] hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]"
                }`}
              >
                <span className="relative z-10">{tier.cta}</span>
                <ArrowRight size={16} className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0 group-active:translate-x-0" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="relative z-10 border-t border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.16),transparent_65%)] px-6 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/40 bg-violet-500/15 text-violet-300">
          <Sparkles size={26} />
        </span>
        <h2 className="mx-auto mt-6 max-w-[700px] text-[clamp(32px,4.5vw,52px)] font-bold leading-tight tracking-tight">
          Your next big idea deserves{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            a faster start.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-[480px] text-slate-400">
          Join AIForge free and turn prompts into finished work in minutes.
        </p>
        <Link
          href="/register"
          className="group relative mt-8 inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-8 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.65)]"
        >
          <span className="relative z-10">Create free account</span>
          <ArrowRight
            size={18}
            className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
          <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#080910] text-sm">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-8 px-6 py-10 lg:flex-row lg:justify-between lg:gap-6">
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-bold">
              AI<span className="text-violet-400">Forge</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-400">
            <a href="#tools" className="transition-colors hover:text-white">
              Tools
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/login" className="transition-colors hover:text-white">
              Sign in
            </Link>
          </nav>
          <p className="shrink-0 text-xs text-slate-500">© 2026 AIForge. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}