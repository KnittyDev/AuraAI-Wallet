"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { motion } from "framer-motion";
import { 
  LuTrendingUp, 
  LuChartLine, 
  LuChartBar, 
  LuArrowUpRight, 
  LuArrowDownRight,
  LuCalendar,
  LuTarget
} from "react-icons/lu";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock Data for Performance
const performanceHistory = [
  { date: "Jan", aura: 10000, market: 10000 },
  { date: "Feb", aura: 11200, market: 10500 },
  { date: "Mar", aura: 10800, market: 9800 },
  { date: "Apr", aura: 12500, market: 11000 },
  { date: "May", aura: 14200, market: 11500 },
  { date: "Jun", aura: 13800, market: 10800 },
  { date: "Jul", aura: 15900, market: 12200 },
  { date: "Aug", aura: 18400, market: 13500 },
  { date: "Sep", aura: 17200, market: 12800 },
  { date: "Oct", aura: 19800, market: 14200 },
  { date: "Nov", aura: 21500, market: 15500 },
  { date: "Dec", aura: 24800, market: 16800 },
];

const monthlyReturns = [
  { month: "Jan", return: 4.2 },
  { month: "Feb", return: 12.0 },
  { month: "Mar", return: -3.5 },
  { month: "Apr", return: 15.7 },
  { month: "May", return: 13.6 },
  { month: "Jun", return: -2.8 },
  { month: "Jul", return: 15.2 },
  { month: "Aug", return: 15.7 },
  { month: "Sep", return: -6.5 },
  { month: "Oct", return: 15.1 },
  { month: "Nov", return: 8.6 },
  { month: "Dec", return: 15.3 },
];

const stats = [
  { label: "Total Return", value: "+148.0%", icon: LuTrendingUp, color: "text-white/70", trend: "+12.4%" },
  { label: "Avg. Monthly", value: "8.4%", icon: LuCalendar, color: "text-white/70", trend: "+1.2%" },
  { label: "Max Drawdown", value: "-6.5%", icon: LuArrowDownRight, color: "text-white/70", trend: "Optimized" },
  { label: "Win Rate", value: "72.4%", icon: LuTarget, color: "text-white/70", trend: "+2.1%" },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function PerformancePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <DashboardSidebar currentPath="/dashboard/performance" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <LuChartLine className="h-5 w-5 text-white" />

                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Performance</h1>
              </div>
              <p className="text-white/50 ml-13">Detailed analysis of your AI-driven returns.</p>
            </div>

            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {["1W", "1M", "3M", "1Y", "ALL"].map((p) => (
                <button 
                  key={p} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${p === "1Y" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className="p-5 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.trend}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Comparison Chart */}
            <motion.div 
              variants={itemVariants}
              className="rounded-[40px] border border-white/15 bg-black/45 p-8 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white">Cumulative Returns</h3>
                  <p className="text-sm text-white/40">Aura AI Strategy vs Market Benchmark</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <span className="text-xs font-medium text-white/60">Aura AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/20" />
                    <span className="text-xs font-medium text-white/40">Market Avg</span>
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceHistory}>
                    <defs>
                      <linearGradient id="auraGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      hide
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                      itemStyle={{ fontSize: "12px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="market" 
                      stroke="rgba(255,255,255,0.1)" 
                      fill="transparent" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="aura" 
                      stroke="#22d3ee" 
                      fillOpacity={1} 
                      fill="url(#auraGradient)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Returns Bar Chart */}
              <motion.div 
                variants={itemVariants}
                className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Monthly Returns (%)</h3>
                  <LuChartBar className="h-5 w-5 text-white/20" />

                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyReturns}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip 
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                      />
                      <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                        {monthlyReturns.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.return > 0 ? "#10b981" : "#f43f5e"} 
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Best Strategy Section */}
              <motion.div 
                variants={itemVariants}
                className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-center"
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <LuArrowUpRight className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white/40 text-sm font-medium uppercase tracking-widest">Top Performing Asset</h4>
                    <p className="text-3xl font-bold text-white mt-1">Solana (SOL)</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                    <LuTrendingUp className="h-5 w-5" />
                    <span>+24.5% this month</span>
                  </div>
                  <p className="text-white/30 text-xs max-w-[280px] mx-auto leading-relaxed">
                    AI strategy optimized positions for high volatility periods, resulting in outperformance against the market benchmark.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
