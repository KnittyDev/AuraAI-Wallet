"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuCircleCheck,
  LuActivity,
  LuDatabase,
  LuCpu,
  LuGlobe,
  LuZap,
  LuShieldCheck,
  LuClock
} from "react-icons/lu";
import Link from "next/link";
import auralogo from "@/app/auralogo.png";
import Image from "next/image";

const SYSTEMS = [
  {
    name: "Aura Core API",
    status: "Operational",
    uptime: "99.99%",
    latency: "42ms",
    icon: LuZap,
    color: "emerald"
  },
  {
    name: "Claude API",
    status: "Operational",
    uptime: "100%",
    latency: "12ms",
    icon: LuCpu,
    color: "emerald"
  },
  {
    name: "Vector Database Cluster",
    status: "Operational",
    uptime: "99.98%",
    latency: "8ms",
    icon: LuDatabase,
    color: "emerald"
  },
  {
    name: "Edge Runtime Nodes",
    status: "Operational",
    uptime: "99.95%",
    latency: "115ms",
    icon: LuGlobe,
    color: "emerald"
  },
  {
    name: "Security Guard (WAF)",
    status: "Operational",
    uptime: "100%",
    latency: "< 1ms",
    icon: LuShieldCheck,
    color: "emerald"
  }
];

export default function StatusPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <AuroraBackground />
      <div className="landing-grid-overlay fixed inset-0" />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-8 md:px-10 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src={auralogo} alt="Aura Logo" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-xl tracking-tighter">AuraAI</span>
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          All Systems Operational
        </div>
      </nav>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <LuCircleCheck className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            System Status
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-lg max-w-xl mx-auto"
          >
            Real-time monitoring of AuraAI neural infrastructure and global trading nodes.
          </motion.p>
        </div>

        {/* Status Grid */}
        <div className="space-y-4">
          {SYSTEMS.map((system, idx) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all">
                  <system.icon className="h-6 w-6 text-white/40 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-500 transition-colors">{system.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <LuActivity className="h-3 w-3" /> {system.latency}
                    </span>
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <LuClock className="h-3 w-3" /> {system.uptime} Uptime
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Simulated mini uptime graph */}
                <div className="hidden md:flex items-end gap-1 h-8">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-emerald-500/20 rounded-full transition-all duration-1000"
                      style={{ height: mounted ? `${40 + Math.random() * 60}%` : "50%" }}
                    />
                  ))}
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  {system.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div>
            <p className="text-sm text-white/40 font-medium">Last incident reported: <span className="text-white">None in the last 90 days.</span></p>
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em] mt-2">Update frequency: Every 60 seconds</p>
          </div>
          <Link
            href="/"
            className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-black transition-all"
          >
            Back to AuraAI
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
