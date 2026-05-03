"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { LuArrowUpRight, LuArrowDownRight, LuTrendingUp, LuWallet, LuShield, LuZap, LuPlus } from "react-icons/lu";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

const stats = [
  { label: "Total Capital", value: "$67,820", note: "+6.4% this month", up: true },
  { label: "Open Positions", value: "12", note: "9 long / 3 short", up: true },
  { label: "Monthly Profit", value: "$3,350", note: "Aura AI Strategy", up: true },
  { label: "Best Asset", value: "BTC", note: "+11.2% this month", up: true },
];

const allocations = [
  { name: "Core Holdings", ratio: 58, note: "BTC + ETH long-term", icon: LuShield, color: "from-white/30 to-white/10" },
  { name: "Growth Bucket", ratio: 24, note: "SOL, AI and high-beta tokens", icon: LuTrendingUp, color: "from-white/20 to-white/5" },
  { name: "Stable Reserve", ratio: 18, note: "USDT liquidity for entries", icon: LuZap, color: "from-white/15 to-white/5" },
];

const holdings = [
  { asset: "Bitcoin", code: "BTC", amount: "0.44", value: "$28,600", change: "+5.3%", allocation: 42, up: true, icon: SiBitcoin },
  { asset: "Ethereum", code: "ETH", amount: "6.12", value: "$18,740", change: "+3.8%", allocation: 28, up: true, icon: SiEthereum },
  { asset: "Solana", code: "SOL", amount: "210", value: "$7,980", change: "-1.2%", allocation: 12, up: false, icon: SiSolana },
  { asset: "Tether", code: "USDT", amount: "12,500", value: "$12,500", change: "0.0%", allocation: 18, up: true, icon: SiTether },
];

const activeStrategies = [
  { id: "#AUR-4421", asset: "BTC", type: "Long", entry: "$61,200", pnl: "+$1,840", pnlPct: "+7.1%", status: "Active", up: true },
  { id: "#AUR-4380", asset: "ETH", type: "Long", entry: "$2,850", pnl: "+$320", pnlPct: "+3.1%", status: "Active", up: true },
  { id: "#AUR-4312", asset: "SOL", type: "Short", entry: "$145", pnl: "-$90", pnlPct: "-1.2%", status: "Watching", up: false },
];

export default function InvestmentsPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      <DashboardSidebar currentPath="/dashboard/investments" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Investments</h1>
              <p className="text-white/50">Live overview of your portfolio, allocations, and AI-managed positions.</p>
            </div>
            <Link
              href="/dashboard/new-investment"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
            >
              <LuPlus className="h-4 w-4" />
              New Investment
            </Link>
          </header>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
              >
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-3">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight text-white mb-2">{stat.value}</p>
                <p className={`text-xs font-medium flex items-center gap-1 ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.up ? <LuArrowUpRight className="h-3 w-3" /> : <LuArrowDownRight className="h-3 w-3" />}
                  {stat.note}
                </p>
              </motion.div>
            ))}
          </div>





          {/* Active Strategies */}
          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Aura AI</p>
                <h2 className="text-2xl font-bold text-white">Active Strategies</h2>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">ID</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Asset</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Entry</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">P&L</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeStrategies.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs text-white/40">{s.id}</span>
                      </td>
                      <td className="px-8 py-5 font-semibold text-white">{s.asset}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          s.type === "Long"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                        }`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-mono text-sm text-white/80">{s.entry}</td>
                      <td className="px-8 py-5">
                        <p className={`font-semibold ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.pnl}</p>
                        <p className={`text-xs ${s.up ? "text-emerald-400/60" : "text-red-400/60"}`}>{s.pnlPct}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 text-xs font-bold ${
                          s.status === "Active" ? "text-emerald-400" : "text-amber-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                            s.status === "Active" ? "bg-emerald-400" : "bg-amber-400"
                          }`} />
                          {s.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
