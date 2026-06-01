"use client";

import { motion, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { supabase } from "@/lib/supabase";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuWallet,
  LuArrowUpRight,
  LuArrowDownLeft,
  LuHistory,
  LuSettings,
  LuTrendingUp,
  LuSparkles,
  LuCreditCard,
  LuCheck,
  LuX,
  LuRefreshCw,
  LuTrendingDown
} from "react-icons/lu";


import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";
import { useLanguage } from "@/context/language-context";



const INITIAL_ASSETS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", balance: 0.42, icon: SiBitcoin, color: "text-white/60" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", balance: 5.84, icon: SiEthereum, color: "text-white/60" },
  { id: "solana", name: "Solana", symbol: "SOL", balance: 142.5, icon: SiSolana, color: "text-white/60" },
  { id: "tether", name: "Tether", symbol: "USDT", balance: 12450.00, icon: SiTether, color: "text-white/60" },
];

const TRANSACTIONS = [
  { id: 1, type: "deposit", asset: "USDT", amount: "+5,000.00", date: "Oct 24, 2026", status: "Completed" },
  { id: 2, type: "withdrawal", asset: "BTC", amount: "-0.05", date: "Oct 22, 2026", status: "Processing" },
  { id: 3, type: "deposit", asset: "SOL", amount: "+25.00", date: "Oct 18, 2026", status: "Completed" },
];

export default function WalletPage() {
  const { language, t } = useLanguage();
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getTxLabel = (tx: any) => {
    if (tx.id?.toString().startsWith("principal-")) {
      return `${t("wallet.principalReturn")} (${tx.assetPlan || tx.asset} ${t("wallet.planLabel")})`;
    }
    if (tx.id?.toString().startsWith("profit-")) {
      return `${t("wallet.strategyProfit")} (${tx.assetPlan || tx.asset} ${t("wallet.planLabel")})`;
    }
    const typeLower = tx.type?.toLowerCase();
    if (typeLower === "deposit") return t("wallet.typeDeposit");
    if (typeLower === "withdrawal") return t("wallet.typeWithdrawal");
    if (typeLower === "profit") return t("wallet.typeProfit");
    if (typeLower === "investment") return t("wallet.typeInvestment");
    return tx.customLabel || tx.type;
  };

  const getTxStatus = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") return t("wallet.statusCompleted");
    if (statusLower === "processing") return t("wallet.statusProcessing");
    return status;
  };

  const formatAssetBalance = (balance: number, symbol: string) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: symbol === "USDT" ? 2 : 6
    }).format(balance);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [balanceRes, priceRes, transactionRes, investmentRes, profitRes] = await Promise.all([
          supabase.from('balances').select('*').eq('user_id', user.id),
          fetch("/api/prices").then(res => res.json()),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('investments').select('*').eq('user_id', user.id),
          supabase.from('ai_actions').select('investment_id, profit_usd').eq('user_id', user.id)
        ]);

        if (!balanceRes.error) {
          setBalances(balanceRes.data);
        }
        if (!investmentRes.error) {
          setInvestments(investmentRes.data);
        }
        
        if (!transactionRes.error && transactionRes.data) {
          const rawTxs = transactionRes.data;
          
          // Generate completed investment payout transactions
          const dynamicTxs: any[] = [];
          if (investmentRes.data && investmentRes.data.length > 0) {
            const profitMap: Record<string, number> = {};
            if (profitRes.data) {
              profitRes.data.forEach(p => {
                profitMap[p.investment_id] = (profitMap[p.investment_id] || 0) + Number(p.profit_usd || 0);
              });
            }

            investmentRes.data.forEach(inv => {
              if (inv.status !== 'active') {
                const maturityDate = new Date(inv.created_at);
                maturityDate.setDate(maturityDate.getDate() + inv.duration_days);
                
                // Principal Return
                dynamicTxs.push({
                  id: `principal-${inv.id}`,
                  type: "Investment",
                  asset: "USDT",
                  amount: Number(inv.amount),
                  status: "Completed",
                  created_at: maturityDate.toISOString(),
                  tx_id: `RET-${inv.id.slice(0, 8)}-${inv.asset_code}`,
                  customLabel: `Principal Return (${inv.asset_code} Plan)`,
                  assetPlan: inv.asset_code
                });

                // Strategy Profit
                const profitAmount = profitMap[inv.id] || 0;
                dynamicTxs.push({
                  id: `profit-${inv.id}`,
                  type: "Profit",
                  asset: "USDT",
                  amount: profitAmount,
                  status: "Completed",
                  created_at: maturityDate.toISOString(),
                  tx_id: `PRFT-${inv.id.slice(0, 8)}-${inv.asset_code}`,
                  customLabel: `Strategy Profit (${inv.asset_code} Plan)`,
                  assetPlan: inv.asset_code
                });
              }
            });
          }

          const combined = [...rawTxs, ...dynamicTxs]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10);
          
          setTransactions(combined);
        }
        setPrices(priceRes);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const assetsWithPrices = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: SiBitcoin, color: "text-white/60" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: SiEthereum, color: "text-white/60" },
    { id: "solana", name: "Solana", symbol: "SOL", icon: SiSolana, color: "text-white/60" },
    { id: "tether", name: "Tether", symbol: "USDT", icon: SiTether, color: "text-white/60" },
  ].map((asset) => {
    const balanceItem = balances.find(b => b.asset_code === asset.symbol);
    const balance = balanceItem ? Number(balanceItem.amount) : 0;
    const priceData = prices?.[asset.id];
    const usdValue = priceData ? balance * priceData.usd : 0;

    return {
      ...asset,
      balance,
      price: priceData?.usd || 0,
      change: priceData?.usd_24h_change?.toFixed(2) || "0.00",
      value: usdValue,
    };
  });

  const availableBalance = assetsWithPrices.reduce((acc, asset) => acc + asset.value, 0);
  const inStrategies = investments.filter(inv => inv.status === 'active').reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalNetWorth = availableBalance + inStrategies;

  // 24h P&L based on available assets
  const pnl24h = assetsWithPrices.reduce((acc, asset) => {
    const currentVal = asset.value;
    const changePct = Number(asset.change);
    const oldVal = currentVal / (1 + (changePct / 100));
    return acc + (currentVal - oldVal);
  }, 0);
  
  const totalChangePct = totalNetWorth > 0 ? (pnl24h / (totalNetWorth - pnl24h)) * 100 : 0;

  // Animation for the balance counter
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(latest)
  );

  useEffect(() => {
    if (!loading && totalNetWorth >= 0) {
      const controls = animate(count, totalNetWorth, { 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1] // Custom ease for smoother start
      });
      return controls.stop;
    }
  }, [loading, totalNetWorth, count]);


  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/wallet" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <LuWallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">{t("wallet.title")}</h1>
              </div>
              <p className="text-white/50 ml-12">{t("wallet.subtitle")}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/deposit" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all">
                <LuArrowDownLeft className="h-4 w-4" />
                {t("wallet.deposit")}
              </Link>
              <Link href="/dashboard/withdraw" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                <LuArrowUpRight className="h-4 w-4" />
                {t("wallet.withdraw")}
              </Link>

            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-12 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <LuSparkles className="h-48 w-48 text-white rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4 flex items-center gap-2">
                  {t("wallet.totalNetWorth")}
                  {loading && <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
                </div>

                <div className="flex flex-wrap items-baseline gap-3 md:gap-4 mb-8">
                  <motion.h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white break-words tabular-nums">
                    $<motion.span>{rounded}</motion.span>
                  </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">{t("wallet.available")}</p>
                    <p className="text-xl font-semibold text-white/90">
                      ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(availableBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">{t("wallet.inStrategies")}</p>
                    <p className="text-xl font-semibold text-white/90">
                      ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(inStrategies)}
                    </p>
                  </div>
                  <div />
                </div>
              </div>
            </motion.div>

            {/* Assets & Promo Row */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Assets List */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-xl font-semibold text-white">{t("wallet.assetBreakdown")}</h3>
                  <Link 
                    href="/dashboard/convert" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    {t("wallet.convertAssets")}
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {assetsWithPrices.map((asset, i) => (
                    <motion.div
                      key={asset.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.03] p-4 md:p-6 hover:bg-white/[0.06] transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-start md:items-center justify-between mb-4 md:mb-6">
                        <div className={`h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-black flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors shrink-0`}>
                          <asset.icon className={`h-4 w-4 md:h-6 md:w-6 ${asset.color}`} />
                        </div>
                        <span className={`text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg ${Number(asset.change) >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                          }`}>
                          {Number(asset.change) >= 0 ? "+" : ""}{asset.change}%
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[10px] md:text-sm font-medium text-white/50 mb-0.5 md:mb-1 truncate">{asset.name}</h4>
                        <div className="flex items-baseline gap-1 md:gap-2">
                          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
                            {formatAssetBalance(asset.balance, asset.symbol)}
                          </p>
                          <span className="text-[9px] md:text-xs font-bold text-white/20 shrink-0">{asset.symbol}</span>
                        </div>
                        <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mt-1 md:mt-2 gap-0.5">
                          <p className="text-[10px] md:text-sm text-white/40 truncate">
                            ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(asset.value)}
                          </p>
                          <p className="text-[8px] md:text-[10px] text-white/20 font-mono truncate">
                            ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Crypto Card Promo */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-xl font-semibold text-white">{t("wallet.specialOffer")}</h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col flex-1 gap-6"
                >
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                        <LuCreditCard className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-white/20 uppercase border border-white/10 px-2 py-1 rounded-full">{t("wallet.comingSoon")}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight whitespace-pre-line">{t("wallet.cardTitle")}</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-6">{t("wallet.cardSubtitle")}</p>

                    {/* Physical Card Mockup */}
                    <div className="relative w-full aspect-[1.586/1] mb-8 group cursor-pointer mt-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between p-6 transition-transform group-hover:rotate-[-2deg] group-hover:scale-[1.02]">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Image src={auraLogo} alt="Aura Logo" width={24} height={24} className="rounded-md" />
                            <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Aura</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold tracking-widest text-white/40 uppercase">{t("wallet.cardElite")}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-lg font-mono tracking-widest text-white/80">•••• •••• •••• 8842</p>
                          <div className="flex justify-between items-end">
                            <p className="text-[10px] font-medium tracking-widest text-white/40 uppercase">{t("wallet.cardPlatinum")}</p>
                            <div className="flex -space-x-2">
                              <div className="h-6 w-6 rounded-full bg-red-500/80" />
                              <div className="h-6 w-6 rounded-full bg-orange-500/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/card"
                    className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 active:scale-95 group mt-auto relative z-10"
                  >
                    {t("wallet.discoverCard")}
                    <LuArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-12"
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <LuHistory className="h-5 w-5 text-white/40" />
                  <h3 className="text-xl font-semibold text-white">{t("wallet.recentActivity")}</h3>
                </div>
                <Link href="/dashboard/transactions" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                  {t("wallet.viewAll")}
                </Link>
              </div>

              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden">
                
                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <div key={`mobile-${tx.id}`} className="p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border border-white/5 shadow-md ${tx.type === "Deposit" || tx.type === "Profit" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                            {tx.type === "Deposit" || tx.type === "Profit" ? <LuArrowDownLeft className="h-5 w-5" /> : <LuArrowUpRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{getTxLabel(tx)}</p>
                            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${tx.status === "Completed" ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : "bg-white/5 text-white/40 border border-white/10"}`}>
                              {getTxStatus(tx.status)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-sm font-bold ${Number(tx.amount) > 0 ? "text-emerald-400" : "text-white"}`}>
                            {Number(tx.amount) > 0 ? "+" : ""}{Number(tx.amount).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-white/40 mt-1 font-bold uppercase tracking-widest">{tx.asset}</p>
                        </div>
                      </div>
                      <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-white/30 uppercase tracking-widest font-bold text-[9px]">{t("wallet.dateLabel")}</span>
                        <span className="text-white/80 font-medium">{new Date(tx.created_at).toLocaleDateString({ en: "en-US", tr: "tr-TR", de: "de-DE", sv: "sv-SE", es: "es-ES", el: "el-GR", ru: "ru-RU" }[language], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="p-8 text-center text-white/20 italic text-sm">
                      {t("wallet.noRecentActivity")}
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{t("wallet.transactionHeader")}</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{t("wallet.assetHeader")}</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{t("wallet.amountHeader")}</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{t("wallet.dateHeader")}</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right">{t("wallet.statusHeader")}</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === "Deposit" || tx.type === "Profit" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                              }`}>
                              {tx.type === "Deposit" || tx.type === "Profit" ? <LuArrowDownLeft className="h-4 w-4" /> : <LuArrowUpRight className="h-4 w-4" />}
                            </div>
                            <span className="text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                              {getTxLabel(tx)}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-white/70">{tx.asset}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-sm font-mono font-bold ${Number(tx.amount) > 0 ? "text-emerald-400" : "text-white"
                            }`}>
                            {Number(tx.amount) > 0 ? "+" : ""}{Number(tx.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm text-white/40">
                          {new Date(tx.created_at).toLocaleDateString(language === "tr" ? "tr-TR" : language === "de" ? "de-DE" : language === "sv" ? "sv-SE" : language === "es" ? "es-ES" : language === "el" ? "el-GR" : language === "ru" ? "ru-RU" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${tx.status === "Completed" ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"
                            }`}>
                            {getTxStatus(tx.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-white/20 italic">
                          {t("wallet.noRecentActivity")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  </main>
  );
}
