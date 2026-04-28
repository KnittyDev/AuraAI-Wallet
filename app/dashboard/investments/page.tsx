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

          {/* Allocation Strategy */}
          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">AI Strategy</p>
                <h2 className="text-2xl font-bold text-white">Allocation Breakdown</h2>
              </div>
              <div className="flex gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                {allocations.map((a) => (
                  <div key={a.name} className="flex items-center gap-2 px-4 py-2">
                    <span className="text-xs font-mono font-bold text-white">{a.ratio}%</span>
                    <span className="text-[10px] text-white/40 hidden md:block">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stacked Bar */}
            <div className="flex w-full h-3 overflow-hidden rounded-full mb-8 gap-px">
              {allocations.map((a) => (
                <motion.div
                  key={a.name}
                  className="h-full bg-white first:rounded-l-full last:rounded-r-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${a.ratio}%` }}
                  transition={{ duration: 1, ease: "circOut", delay: 0.3 }}
                  style={{ opacity: a.ratio / 58 * 0.9 + 0.1 }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allocations.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/50">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-4xl font-bold text-white tracking-tight">{item.ratio}%</span>
                    </div>
                    <p className="font-semibold text-white mb-1">{item.name}</p>
                    <p className="text-xs text-white/40">{item.note}</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-white/60"
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.ratio}%` }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Holdings Table */}
          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Portfolio</p>
                <h2 className="text-2xl font-bold text-white">Asset Holdings</h2>
              </div>
              <LuWallet className="h-5 w-5 text-white/20" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Asset</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Value</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">24h</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {holdings.map((row, i) => {
                    const Icon = row.icon;
                    return (
                      <motion.tr
                        key={row.asset}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 group-hover:bg-white/10 transition-colors">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{row.asset}</p>
                              <p className="text-xs text-white/30">{row.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-mono text-sm text-white">{row.amount}</p>
                          <p className="text-[10px] text-white/20 mt-0.5 uppercase">{row.code}</p>
                        </td>
                        <td className="px-8 py-5 font-semibold text-white">{row.value}</td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${row.up ? "text-emerald-400" : "text-red-400"}`}>
                            {row.up ? <LuArrowUpRight className="h-3 w-3" /> : <LuArrowDownRight className="h-3 w-3" />}
                            {row.change}
                          </span>
                        </td>
                        <td className="px-8 py-5 min-w-[160px]">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                              <motion.div
                                className="h-full rounded-full bg-white/50"
                                initial={{ width: "0%" }}
                                animate={{ width: `${row.allocation}%` }}
                                transition={{ duration: 0.7, ease: "circOut", delay: 0.3 + i * 0.05 }}
                              />
                            </div>
                            <span className="text-xs font-mono text-white/40 w-8 text-right">{row.allocation}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
