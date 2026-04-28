"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LuArrowUpRight, LuShield, LuTrendingUp, LuZap } from "react-icons/lu";

const stats = [
  { icon: LuTrendingUp, value: "$2.4B+", label: "Assets Managed" },
  { icon: LuShield, value: "99.9%", label: "Uptime" },
  { icon: LuZap, value: "12ms", label: "Avg. Response" },
];

export function PromptCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="mt-14 w-full max-w-4xl"
    >
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition hover:bg-white/90 hover:scale-105 active:scale-95"
        >
          Start for Free
          <LuArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
        >
          Sign In
        </Link>
      </div>

      {/* Stats Row */}
      <div className="mx-auto grid grid-cols-3 max-w-2xl divide-x divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col items-center gap-2 px-6 py-6">
              <Icon className="h-4 w-4 text-white/30 mb-1" />
              <p className="text-2xl font-bold tracking-tight text-white">{s.value}</p>
              <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Live Signal Ticker */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="flex items-center gap-2 text-[11px] font-medium text-white/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Aura AI is running live strategies
        </span>
        <span className="text-white/10">·</span>
        <span className="text-[11px] text-white/20">12 positions opened today</span>
      </div>
    </motion.div>
  );
}
