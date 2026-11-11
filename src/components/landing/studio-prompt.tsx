"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function StudioPrompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = prompt.trim();
    const href = q ? `/register?prompt=${encodeURIComponent(q.slice(0, 200))}` : "/register";
    router.push(href);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 transition-all duration-300 focus-within:border-violet-400/45 focus-within:bg-violet-500/[0.06] focus-within:shadow-[0_0_24px_rgba(139,92,246,0.18)] sm:mt-8 sm:px-4"
    >
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to create..."
        className="min-w-0 flex-1 bg-transparent text-left text-sm text-slate-200 outline-none placeholder:text-slate-500"
        aria-label="Describe what you want to create"
      />
      <button
        type="submit"
        aria-label="Start creating"
        className="group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_18px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] active:scale-95"
      >
        <ArrowRight
          size={17}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        />
        <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
      </button>
    </form>
  );
}
