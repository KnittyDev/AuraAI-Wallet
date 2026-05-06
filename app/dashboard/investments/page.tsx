"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AiActionLog } from "@/components/dashboard/ai-action-log";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuPlus, LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";

interface Investment {
  id: string;
  asset_code: string;
  amount: number;
  risk_profile: string;
  duration_days: number;
  status: string;
  created_at: string;
}

interface AiAction {
  id: string;
  asset_code: string;
  action_type: 'long' | 'short';
  entry_price: number;
  exit_price?: number;
  profit_usd?: number;
  status: 'open' | 'closed';
  created_at: string;
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profits, setProfits] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<AiAction[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [invRes, profitRes, priceRes] = await Promise.all([
        supabase.from('investments').select('*').eq('user_id', user.id),
        supabase.from('ai_actions').select('investment_id, profit_usd').eq('user_id', user.id),
        fetch('/api/prices').then(res => res.json())
      ]);

      if (!invRes.error) setInvestments(invRes.data);

      if (!profitRes.error && profitRes.data) {
        const profitMap: Record<string, number> = {};
        profitRes.data.forEach(p => {
          profitMap[p.investment_id] = (profitMap[p.investment_id] || 0) + Number(p.profit_usd || 0);
        });
        setProfits(profitMap);
      }

      setPrices({
        BTC: priceRes.bitcoin?.usd || 0,
        ETH: priceRes.ethereum?.usd || 0,
        SOL: priceRes.solana?.usd || 0,
        USDT: 1
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  const fetchLogs = async (invId: string) => {
    setSelectedInvId(invId);
    setLoadingLogs(true);
    const { data, error } = await supabase
      .from('ai_actions')
      .select('*')
      .eq('investment_id', invId)
      .order('created_at', { ascending: false })
      .limit(25);

    if (!error) setSelectedLogs(data);
    setLoadingLogs(false);
  };

  const totalCapital = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalProfit = Object.values(profits).reduce((acc, p) => acc + p, 0);
  const activeCount = investments.filter(inv => inv.status === 'active').length;

  const stats = [
    { label: "Total Capital", value: `$${totalCapital.toLocaleString()}`, note: "Invested in strategies", up: true },
    { label: "Total Net Profit", value: `$${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, note: "Realized earnings", up: totalProfit >= 0 },
    { label: "Active Strategies", value: activeCount.toString(), note: "Currently managed by AI", up: true },
    { label: "AI Engine", value: "Claude Opus 4.7", note: "Online & Scanning", up: true },
  ];

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>;
  }

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
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/deposit"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <LuArrowUpRight className="h-4 w-4" />
                Deposit
              </Link>
              <Link
                href="/dashboard/new-investment"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                <LuPlus className="h-4 w-4" />
                New Investment
              </Link>
            </div>
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
                <p className="text-xs font-medium flex items-center gap-1 text-emerald-400">
                  {stat.note}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Active Strategies */}
          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Active Strategies</h2>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Asset</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Capital</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Net Profit</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Duration</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Risk</th>
                    <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {investments.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">{inv.asset_code}</span>
                          <span className="text-[10px] text-white/20 font-mono tracking-tighter">#{inv.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-mono text-sm text-white/80">${Number(inv.amount).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={`font-mono text-sm font-bold ${profits[inv.id] >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {profits[inv.id] >= 0 ? "+" : ""}{Number(profits[inv.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-medium text-white/60">{inv.duration_days} Days</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${inv.risk_profile === "Aggressive"
                            ? "text-red-400 bg-red-400/10 border-red-400/20"
                            : inv.risk_profile === "Growth"
                              ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                              : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                          }`}>
                          {inv.risk_profile}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => fetchLogs(inv.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedInvId === inv.id
                            ? "bg-white text-black"
                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          {selectedInvId === inv.id ? "Viewing Logs" : "View Logs"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Strategy Logs */}
          <AnimatePresence>
            {selectedInvId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white">Strategy Execution Feed</h2>
                  <button
                    onClick={() => setSelectedInvId(null)}
                    className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest"
                  >
                    Close Feed
                  </button>
                </div>
                {loadingLogs ? (
                  <div className="h-64 flex items-center justify-center border border-white/5 rounded-[32px] bg-black/20 italic text-white/20">
                    Accessing AuraAI neural link...
                  </div>
                ) : (
                  <AiActionLog actions={selectedLogs} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
