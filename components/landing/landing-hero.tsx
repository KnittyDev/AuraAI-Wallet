"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function LandingHero() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-white/60 tracking-[0.2em] uppercase">Claude Opus 4.7 — Max</span>
      </motion.div>

      <h1 className="mx-auto max-w-[16ch] text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.0] tracking-tight text-white">
        Let AI Manage{" "}
        <span className="relative inline-block">
          <span className="relative z-10">Your Portfolio</span>
          <span
            className="absolute inset-x-0 bottom-1 h-[0.15em] rounded-full bg-gradient-to-r from-cyan-400/60 via-white/60 to-violet-400/60 blur-[2px]"
            aria-hidden
          />
        </span>
      </h1>

      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/55 md:text-xl">
        Aura AI continuously analyzes markets, manages risk, and executes trades — 
        so your portfolio keeps working even when you don't.
      </p>

      {/* Hero CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        <Link
          href={user ? "/dashboard" : "/register"}
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition hover:bg-white/90 hover:scale-105 active:scale-95"
        >
          {user ? "Go to Dashboard" : "Start for Free"}
          <LuArrowUpRight className="h-4 w-4" />
        </Link>
        <a
          href="https://calendly.com/auraai/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
        >
          Let's Talk
        </a>
      </div>
    </motion.div>
  );
}
