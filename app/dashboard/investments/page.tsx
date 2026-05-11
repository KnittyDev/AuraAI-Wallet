"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AiActionLog } from "@/components/dashboard/ai-action-log";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuPlus, LuArrowUpRight, LuArrowDownRight, LuDownload, LuInfo, LuX, LuCalendar, LuClock, LuActivity } from "react-icons/lu";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";

interface Investment {
  id: string;
  asset_code: string;
  amount: number;
  asset_amount?: number;
  entry_price?: number;
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
  const [profits24h, setProfits24h] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<AiAction[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [infoModalInvestment, setInfoModalInvestment] = useState<Investment | null>(null);
  const logsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [invRes, profitRes, priceRes] = await Promise.all([
        supabase.from('investments').select('*').eq('user_id', user.id),
        supabase.from('ai_actions').select('investment_id, profit_usd, created_at').eq('user_id', user.id),
        fetch('/api/prices').then(res => res.json())
      ]);

      if (!invRes.error) setInvestments(invRes.data);

      if (!profitRes.error && profitRes.data) {
        const profitMap: Record<string, number> = {};
        const p24Map: Record<string, number> = {};
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        profitRes.data.forEach(p => {
          profitMap[p.investment_id] = (profitMap[p.investment_id] || 0) + Number(p.profit_usd || 0);
          
          if (new Date(p.created_at) > yesterday) {
            p24Map[p.investment_id] = (p24Map[p.investment_id] || 0) + Number(p.profit_usd || 0);
          }
        });
        setProfits(profitMap);
        setProfits24h(p24Map);
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

    if (!error) {
      setSelectedLogs(data);
      // Smooth scroll to logs section
      setTimeout(() => {
        logsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    setLoadingLogs(false);
  };

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const inv = investments.find(i => i.id === selectedInvId);
    if (!inv) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, 40, 'F');

    try {
      const logoUrl = '/auralogo.png';
      doc.addImage(logoUrl, 'PNG', 14, 10, 10, 10);
    } catch (e) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('AURA', 14, 18);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('AURA TERMINAL', 28, 17);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('Investment Strategy Report', 28, 24);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 28, 30);

    // Investment Summary
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text('Strategy Summary', 14, 52);

    const invProfit = profits[inv.id] || 0;

    autoTable(doc, {
      startY: 58,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 9 },
      head: [['Asset', 'Capital', 'Asset Quantity', 'Net Profit', 'Duration', 'Risk Profile', 'Status']],
      body: [[
        inv.asset_code,
        `$${Number(inv.amount).toLocaleString()}`,
        inv.asset_amount ? `${inv.asset_amount.toFixed(6)} ${inv.asset_code}` : '—',
        `${invProfit >= 0 ? '+' : ''}${invProfit.toFixed(2)} USDT`,
        `${inv.duration_days} Days`,
        inv.risk_profile,
        inv.status
      ]]
    });

    // Protection Disclaimer
    const disclaimerY = (doc as any).lastAutoTable?.finalY || 75;
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "italic");
    doc.text('Note: In the event of an overall strategy loss, 15% of the loss will be reimbursed to the user', 14, disclaimerY + 10);
    doc.text('as part of the Aura Protection Program.', 14, disclaimerY + 14);
    doc.setFont("helvetica", "normal");

    // Execution Log
    const tableEndY = disclaimerY + 20;
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Execution Log', 14, tableEndY + 10);

    const logRows = selectedLogs.map(log => [
      new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      log.action_type.toUpperCase(),
      log.asset_code,
      `$${log.entry_price.toLocaleString()}`,
      log.exit_price ? `$${log.exit_price.toLocaleString()}` : '—',
      log.profit_usd != null ? `${log.profit_usd >= 0 ? '+' : ''}${log.profit_usd.toFixed(2)}` : '—',
      log.status
    ]);

    autoTable(doc, {
      startY: tableEndY + 20,
      theme: 'striped',
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontSize: 7 },
      bodyStyles: { fontSize: 7 },
      head: [['Date', 'Type', 'Asset', 'Entry', 'Exit', 'P&L', 'Status']],
      body: logRows
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(`Aura Investment Terminal  •  Page ${p}/${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    }

    doc.save(`aura-strategy-${inv.asset_code}-${inv.id.slice(0, 8)}.pdf`);
  };

  const totalCapital = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalProfit = Object.values(profits).reduce((acc, p) => acc + p, 0);
  const activeCount = investments.filter(inv => inv.status === 'active').length;

  const stats = [
    { label: "Total Capital", value: `$${totalCapital.toLocaleString()}`, note: "Invested in strategies", up: true },
    { label: "Total Net Profit", value: `$${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, note: "Realized earnings", up: totalProfit >= 0 },
    { label: "Active Strategies", value: activeCount.toString(), note: "Currently managed by AI", up: true },
    { label: "AI Engine", value: "Claude 4.7", note: "Online & Scanning", up: true },
  ];

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/investments" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
          <div className="mx-auto max-w-6xl space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Investments</h1>
                <p className="text-white/50">Live overview of your portfolio, allocations, and AI-managed positions.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/dashboard/deposit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <LuArrowUpRight className="h-4 w-4" />
                  Deposit
                </Link>
                <Link
                  href="/dashboard/new-investment"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 whitespace-nowrap"
                >
                  <LuPlus className="h-4 w-4" />
                  New Investment
                </Link>
              </div>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-white/30 uppercase mb-2 md:mb-3 truncate">{stat.label}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 md:mb-2 truncate">{stat.value}</p>
                  </div>
                  <p className="text-[9px] md:text-xs font-medium text-emerald-400 leading-snug line-clamp-2">
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
              {/* Mobile Card View */}
              <div className="block md:hidden divide-y divide-white/5">
                {investments.map((inv, i) => (
                  <motion.div
                    key={`mobile-${inv.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="p-6 space-y-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">{inv.asset_code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-widest ${inv.risk_profile === "Aggressive"
                          ? "text-red-400 bg-red-400/10 border-red-400/20"
                          : inv.risk_profile === "Growth"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                          }`}>
                          {inv.risk_profile}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-mono text-sm font-bold ${profits[inv.id] >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {profits[inv.id] >= 0 ? "+" : ""}{Number(profits[inv.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`h-1 w-1 rounded-full animate-pulse ${profits24h[inv.id] < 0 ? "bg-red-400" : "bg-emerald-400"}`} />
                          <span className={`text-[10px] font-mono font-bold ${profits24h[inv.id] < 0 ? "text-red-400" : "text-emerald-400"}`}>
                            24h: {profits24h[inv.id] >= 0 ? "+" : ""}{Number(profits24h[inv.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({((profits24h[inv.id] || 0) / Number(inv.amount) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Capital</span>
                        <span className="text-white/80 font-mono font-bold">${Number(inv.amount).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Duration</span>
                        <span className="text-white/80 font-medium">{inv.duration_days} Days</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setInfoModalInvestment(inv)}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex-1 flex justify-center items-center gap-2"
                      >
                        <LuInfo className="h-4 w-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                      </button>
                      <button
                        onClick={() => fetchLogs(inv.id)}
                        className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex-1 ${selectedInvId === inv.id
                          ? "bg-white text-black"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                          }`}
                      >
                        {selectedInvId === inv.id ? "Viewing Logs" : "View Logs"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Asset</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Capital</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Net Profit</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">24h AI P&L</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Duration</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase">Risk</th>
                      <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-white/30 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {investments.map((inv, i) => (
                      <motion.tr
                        key={`desktop-${inv.id}`}
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
                        <td className="px-8 py-5 font-mono text-sm">
                          <div className="flex flex-col">
                            <span className="text-white/80">${Number(inv.amount).toLocaleString()}</span>
                            {inv.asset_amount && inv.asset_code !== 'USDT' && (
                              <span className="text-[10px] text-white/30">{inv.asset_amount.toFixed(6)} {inv.asset_code}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`font-mono text-sm font-bold ${profits[inv.id] >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {profits[inv.id] >= 0 ? "+" : ""}{Number(profits[inv.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${profits24h[inv.id] < 0 ? "bg-red-400" : "bg-emerald-400"}`} />
                              <span className={`font-mono text-sm font-bold ${profits24h[inv.id] < 0 ? "text-red-400" : "text-emerald-400"}`}>
                                {profits24h[inv.id] >= 0 ? "+" : ""}{Number(profits24h[inv.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                              </span>
                            </div>
                            <span className="text-[10px] text-white/30 ml-3.5">
                              {profits24h[inv.id] >= 0 ? "+" : ""}{((profits24h[inv.id] || 0) / Number(inv.amount) * 100).toFixed(2)}% Yield
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-medium text-white/60">{inv.duration_days} Days</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${inv.risk_profile === "Aggressive"
                            ? "text-red-400 bg-red-400/10 border-red-400/20"
                            : inv.risk_profile === "Growth"
                              ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                              : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                            }`}>
                            {inv.risk_profile}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInfoModalInvestment(inv)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                              title="Strategy Details"
                            >
                              <LuInfo className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => fetchLogs(inv.id)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedInvId === inv.id
                                ? "bg-white text-black"
                                : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                }`}
                            >
                              {selectedInvId === inv.id ? "Viewing Logs" : "View Logs"}
                            </button>
                          </div>
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
                  ref={logsSectionRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6 pt-10"
                >
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-white">Strategy Execution Feed</h2>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={downloadPDF}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
                      >
                        <LuDownload className="h-3.5 w-3.5" />
                        Export PDF
                      </button>
                      <button
                        onClick={() => setSelectedInvId(null)}
                        className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest"
                      >
                        Close Feed
                      </button>
                    </div>
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

        {/* Info Modal */}
        <AnimatePresence>
          {infoModalInvestment && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setInfoModalInvestment(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-zinc-900 p-8 md:p-10 shadow-2xl overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-500/10 blur-[80px] rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <LuActivity className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Strategy Details</h3>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ID: {infoModalInvestment.id.slice(0, 12)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInfoModalInvestment(null)}
                      className="p-2 rounded-full hover:bg-white/10 text-white/20 hover:text-white transition-all"
                    >
                      <LuX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <LuCalendar className="h-3 w-3" /> Start Date
                      </p>
                      <p className="text-sm font-medium text-white">
                        {new Date(infoModalInvestment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <LuClock className="h-3 w-3" /> Maturity Date
                      </p>
                      <p className="text-sm font-medium text-white">
                        {(() => {
                          const date = new Date(infoModalInvestment.created_at);
                          date.setDate(date.getDate() + infoModalInvestment.duration_days);
                          return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-sm text-white/40">Capital Allocation</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">${Number(infoModalInvestment.amount).toLocaleString()} USDT</p>
                        {infoModalInvestment.asset_amount && infoModalInvestment.asset_code !== 'USDT' && (
                          <p className="text-[10px] text-white/30">{infoModalInvestment.asset_amount.toFixed(8)} {infoModalInvestment.asset_code}</p>
                        )}
                      </div>
                    </div>
                    {infoModalInvestment.entry_price && infoModalInvestment.asset_code !== 'USDT' && (
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-sm text-white/40">Entry Price</span>
                        <span className="text-sm font-bold text-white">${infoModalInvestment.entry_price.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-sm text-white/40">Risk Profile</span>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${infoModalInvestment.risk_profile === "Aggressive" ? "text-red-400 border-red-400/20 bg-red-400/5" :
                          infoModalInvestment.risk_profile === "Growth" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                            "text-blue-400 border-blue-400/20 bg-blue-400/5"
                        }`}>
                        {infoModalInvestment.risk_profile.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-sm text-white/40">Execution Status</span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {infoModalInvestment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setInfoModalInvestment(null)}
                    className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98]"
                  >
                    Understood
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
