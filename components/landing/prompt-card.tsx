"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { LuShield, LuTrendingUp, LuZap } from "react-icons/lu";

const stats = [
  { icon: LuTrendingUp, value: "$2.4B+", label: "Assets Managed" },
  { icon: LuShield, value: "99.9%", label: "Uptime" },
  { icon: LuZap, value: "12ms", label: "Avg. Response" },
];

export function PromptCard() {
  const [positionsToday, setPositionsToday] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPositions() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_actions")
        .select("*", { count: 'exact', head: true })
        .gte("created_at", today.toISOString());

      setPositionsToday(count || 0);
    }

    fetchPositions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="mt-14 w-full max-w-4xl"
    >
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
        <span className="text-[11px] text-white/20">
          {positionsToday !== null ? positionsToday.toLocaleString() : "..."} positions opened today
        </span>
      </div>
    </motion.div>
  );
}
