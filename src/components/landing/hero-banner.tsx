"use client";

import { useEffect, useState } from "react";
import { Code2, Image as ImageIcon, WandSparkles } from "lucide-react";

export default function HeroBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setShow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!show) return null;

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center md:max-w-none lg:col-span-6">
      <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-violet-600/40 to-cyan-500/40 blur-[80px]" />

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-[#10111c] to-[#0b0c14] shadow-2xl shadow-violet-950/40 sm:rounded-[30px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ai-forge-banner.png"
          alt="AIForge AI workspace interface preview"
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b12]/70 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl border border-white/15 bg-black/45 px-4 py-3 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/20 text-violet-300">
              <WandSparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                Hyper-Realistic AI Visuals
              </div>
              <div className="text-[10px] leading-4 text-slate-400">
                4K Render • Ultra Detail • Live Studio
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <span className="text-[10px] font-semibold text-violet-300">AI Engine 4.0 Active</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -top-3 right-2 hidden sm:block lg:right-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#10111c]/90 px-3.5 py-2.5 backdrop-blur-md">
          <ImageIcon size={16} className="shrink-0 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">Image Generator</span>
        </div>
      </div>

      <div className="absolute -bottom-3 left-2 hidden sm:block lg:left-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#10111c]/90 px-3.5 py-2.5 backdrop-blur-md">
          <Code2 size={16} className="shrink-0 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Code Assistant</span>
        </div>
      </div>
    </div>
  );
}
