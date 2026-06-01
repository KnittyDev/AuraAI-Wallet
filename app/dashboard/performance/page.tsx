"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  LuTarget,
  LuLoader,
  LuLock,
  LuZap
} from "react-icons/lu";

import { PlanUpgradeModal } from "@/components/dashboard/plan-upgrade-modal";

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
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function PerformancePage() {
  const { language, t } = useLanguage();
  const [investments, setInvestments] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("ALL");
  const [profile, setProfile] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [invRes, actRes, profileRes] = await Promise.all([
        supabase.from('investments').select('*').eq('user_id', user.id),
        supabase.from('ai_actions').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      if (!invRes.error) setInvestments(invRes.data || []);
      if (!actRes.error) setActions(actRes.data || []);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter actions based on selected time range
  const getFilteredActions = () => {
    const now = new Date();
    const closed = actions.filter(a => a.status === 'closed');
    
    if (timeRange === "ALL") return closed;
    
    const cutoff = new Date();
    if (timeRange === "24H") cutoff.setHours(now.getHours() - 24);
    if (timeRange === "1W") cutoff.setDate(now.getDate() - 7);
    if (timeRange === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (timeRange === "1Y") cutoff.setFullYear(now.getFullYear() - 1);
    
    return closed.filter(a => new Date(a.created_at) >= cutoff);
  };

  const filteredActions = getFilteredActions();

  // 1. Process Stats (Dynamic based on filter)
  const totalInvested = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const filteredProfit = filteredActions.reduce((acc, a) => acc + Number(a.profit_usd || 0), 0);
  const totalProfitAllTime = actions.filter(a => a.status === 'closed').reduce((acc, a) => acc + Number(a.profit_usd || 0), 0);
  
  const winRate = filteredActions.length > 0 
    ? (filteredActions.filter(a => Number(a.profit_usd) > 0).length / filteredActions.length) * 100 
    : 0;
  
  const returnPercent = totalInvested > 0 ? (filteredProfit / totalInvested) * 100 : 0;
  
  // 2. Process Performance History (Cumulative)
  // We calculate the cumulative starting from the initial capital
  let runningBalance = totalInvested;
  
  // To show the trend correctly for the selected range, we should find the balance at the start of the range
  const allClosed = actions.filter(a => a.status === 'closed');
  const cutoffDate = timeRange === "ALL" ? new Date(0) : (() => {
    const d = new Date();
    if (timeRange === "24H") d.setHours(d.getHours() - 24);
    if (timeRange === "1W") d.setDate(d.getDate() - 7);
    if (timeRange === "1M") d.setMonth(d.getMonth() - 1);
    if (timeRange === "1Y") d.setFullYear(d.getFullYear() - 1);
    return d;
  })();

  const actionsBeforeRange = allClosed.filter(a => new Date(a.created_at) < cutoffDate);
  let startingBalanceForRange = totalInvested + actionsBeforeRange.reduce((acc, a) => acc + Number(a.profit_usd || 0), 0);
  
    let tempRunning = startingBalanceForRange;
    const performanceHistory = filteredActions.map(a => {
      tempRunning += Number(a.profit_usd || 0);
      return {
        date: new Date(a.created_at).toLocaleDateString(language === "tr" ? "tr-TR" : language === "de" ? "de-DE" : language === "sv" ? "sv-SE" : language === "es" ? "es-ES" : language === "el" ? "el-GR" : "en-US", 
          timeRange === "24H" 
            ? { hour: '2-digit', minute: '2-digit' } 
            : { month: 'short', day: 'numeric' }
        ),
        aura: Number(tempRunning.toFixed(2)),
        market: Number((startingBalanceForRange * (1 + ((Math.random() - 0.4) * 0.02))).toFixed(2))
      };
    });

    // 3. Process Monthly Returns
    const monthlyData: Record<string, number> = {};
    filteredActions.forEach(a => {
      const month = new Date(a.created_at).toLocaleDateString(language === "tr" ? "tr-TR" : language === "de" ? "de-DE" : language === "sv" ? "sv-SE" : language === "es" ? "es-ES" : language === "el" ? "el-GR" : "en-US", { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + Number(a.profit_usd || 0);
    });

    const monthlyReturns = Object.entries(monthlyData).map(([month, profit]) => ({
      month,
      return: Number(((profit / (totalInvested || 1)) * 100).toFixed(2))
    }));

  // 4. Identify Best Asset
  const assetProfits: Record<string, number> = {};
  filteredActions.forEach(a => {
    assetProfits[a.asset_code] = (assetProfits[a.asset_code] || 0) + Number(a.profit_usd || 0);
  });
  const bestAssetEntry = Object.entries(assetProfits).sort((a, b) => b[1] - a[1])[0];
  const bestAsset = bestAssetEntry ? bestAssetEntry[0] : "N/A";

  const statsList = [
    { label: t("performance.stats.rangeReturn"), value: `${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(1)}%`, icon: LuTrendingUp, color: "text-emerald-400", trend: t(`performance.intervals.${timeRange}`) },
    { label: t("performance.stats.rangeProfit"), value: `$${filteredProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: LuCalendar, color: "text-cyan-400", trend: t("performance.stats.realized") },
    { label: t("performance.stats.trades"), value: filteredActions.length.toString(), icon: LuArrowUpRight, color: "text-white/70", trend: t("performance.stats.execution") },
    { label: t("performance.stats.winRate"), value: `${winRate.toFixed(1)}%`, icon: LuTarget, color: "text-amber-400", trend: t("performance.stats.success") },
  ];

  if (profile?.plan === 'free') {
    return (
      <main className="min-h-screen bg-black text-white relative flex overflow-hidden">
        <AuroraBackground />
        <div className="landing-grid-overlay" />
        <DashboardSidebar currentPath="/dashboard/performance" />
        
        <section className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 lg:ml-72">
          <div className="max-w-md w-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl text-center shadow-2xl">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-8 transform rotate-12">
              <LuLock className="h-8 w-8 text-red-500 -rotate-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{t("performance.locked.title")}</h2>
            <p className="text-white/40 mb-10 leading-relaxed">
              {t("performance.locked.subtitle")}
            </p>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              <LuZap className="h-4 w-4" />
              {t("performance.locked.upgradeBtn")}
            </button>
          </div>
        </section>

        <PlanUpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)}
          title={t("performance.modal.title")}
          description={t("performance.modal.description")}
        />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/performance" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl">
          <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <LuChartLine className="h-5 w-5 text-white" />

                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">{t("dashboard.performance")}</h1>
              </div>
              <p className="text-white/50 ml-12">{t("performance.subtitle")}</p>
            </div>

            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {["24H", "1W", "1M", "1Y", "ALL"].map((p) => (
                <button 
                  key={p} 
                  onClick={() => setTimeRange(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${timeRange === p ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                >
                  {t(`performance.intervals.${p}`)}
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
              {statsList.map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className="p-5 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-white text-black shadow-xl shrink-0">
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
                  <h3 className="text-xl font-semibold text-white">{t("performance.charts.cumulativeTitle")}</h3>
                  <p className="text-sm text-white/40">{t("performance.charts.cumulativeSubtitle")}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <span className="text-xs font-medium text-white/60">{t("performance.charts.auraLegend")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/20" />
                    <span className="text-xs font-medium text-white/40">{t("performance.charts.marketLegend")}</span>
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                {performanceHistory.length > 0 ? (
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
                        interval={Math.floor(performanceHistory.length / 7)}
                      />
                      <YAxis 
                        hide
                        domain={['dataMin - 100', 'dataMax + 100']}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, t("performance.charts.tooltipValue")]}
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
                        animationDuration={1500}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aura" 
                        stroke="#22d3ee" 
                        fillOpacity={1} 
                        fill="url(#auraGradient)" 
                        strokeWidth={3}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                    <LuChartLine className="h-12 w-12 opacity-50" />
                    <p className="text-sm font-medium">{t("performance.charts.noActivity")}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Returns Bar Chart */}
              <motion.div 
                variants={itemVariants}
                className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">{t("performance.charts.monthlyTitle")}</h3>
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
                    <h4 className="text-white/40 text-sm font-medium uppercase tracking-widest">{t("performance.bestStrategy.topAsset")}</h4>
                    <p className="text-3xl font-bold text-white mt-1">{bestAsset === "BTC" ? "Bitcoin" : bestAsset === "ETH" ? "Ethereum" : bestAsset === "SOL" ? "Solana" : bestAsset} ({bestAsset})</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                    <LuTrendingUp className="h-5 w-5" />
                    <span>{t("performance.bestStrategy.bannerText")}</span>
                  </div>
                  <p className="text-white/30 text-xs max-w-[280px] mx-auto leading-relaxed">
                    {t("performance.bestStrategy.description")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  </main>
  );
}
