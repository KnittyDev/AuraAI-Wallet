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
  LuShieldCheck,
  LuCreditCard,
  LuCheck,
  LuX,
  LuRefreshCw
} from "react-icons/lu";


import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";



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
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPreOrdered, setIsPreOrdered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [balanceRes, priceRes, transactionRes] = await Promise.all([
          supabase.from('balances').select('*').eq('user_id', user.id),
          fetch("/api/prices").then(res => res.json()),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        ]);

        if (!balanceRes.error) {
          setBalances(balanceRes.data);
        }
        if (!transactionRes.error) {
          setTransactions(transactionRes.data);
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

  const totalBalance = assetsWithPrices.reduce((acc, asset) => acc + asset.value, 0);

  // Animation for the balance counter
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(latest)
  );

  useEffect(() => {
    if (!loading && totalBalance > 0) {
      const controls = animate(count, totalBalance, { duration: 1.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [loading, totalBalance, count]);


  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/wallet" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <LuWallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">My Wallet</h1>
              </div>
              <p className="text-white/50 ml-13">Securely manage your assets and liquidity.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/deposit" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all">
                <LuArrowDownLeft className="h-4 w-4" />
                Deposit
              </Link>
              <Link href="/dashboard/withdraw" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                <LuArrowUpRight className="h-4 w-4" />
                Withdraw
              </Link>

            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-12 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <LuShieldCheck className="h-48 w-48 text-white rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4 flex items-center gap-2">
                  Total Net Worth
                  {loading && <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
                </div>

                <div className="flex items-baseline gap-4 mb-8">
                  <motion.h2 className="text-6xl font-medium tracking-tight text-white">
                    $<motion.span>{rounded}</motion.span>
                  </motion.h2>
                  <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-0.5 rounded-lg">
                    <LuTrendingUp className="h-3 w-3" />
                    +8.4%
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">Available</p>
                    <p className="text-xl font-semibold text-white/90">
                      ${new Intl.NumberFormat("en-US").format(totalBalance * 0.17)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">In Strategies</p>
                    <p className="text-xl font-semibold text-white/90">
                      ${new Intl.NumberFormat("en-US").format(totalBalance * 0.83)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">24h P&L</p>
                    <p className="text-xl font-semibold text-emerald-400">+$2,140</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">Security</p>
                    <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Enforced</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Assets & Promo Row */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Assets List */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-xl font-semibold text-white">Asset Breakdown</h3>
                  <Link 
                    href="/dashboard/convert" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    Convert Assets
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assetsWithPrices.map((asset, i) => (
                    <motion.div
                      key={asset.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className={`h-12 w-12 rounded-2xl bg-black flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors`}>
                          <asset.icon className={`h-6 w-6 ${asset.color}`} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${Number(asset.change) >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                          }`}>
                          {Number(asset.change) >= 0 ? "+" : ""}{asset.change}%
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white/50 mb-1">{asset.name}</h4>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold text-white">{asset.balance}</p>
                          <span className="text-xs font-bold text-white/20">{asset.symbol}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-white/40">
                            ${new Intl.NumberFormat("en-US").format(asset.value)}
                          </p>
                          <p className="text-[10px] text-white/20 font-mono">
                            ${asset.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Crypto Card Promo */}
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-xl font-semibold text-white">Special Offer</h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                        <LuCreditCard className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-white/20 uppercase border border-white/10 px-2 py-1 rounded-full">Coming Soon</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Aura Elite <br />Crypto Bank Card</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-6">Spend your crypto anywhere in the world. 0% fees, 3% cashback.</p>

                    {/* Physical Card Mockup */}
                    <div className="relative w-full aspect-[1.586/1] mb-8 group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between p-6 transition-transform group-hover:rotate-[-2deg] group-hover:scale-[1.02]">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Image src={auraLogo} alt="Aura Logo" width={24} height={24} className="rounded-md" />
                            <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Aura</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold tracking-widest text-white/40 uppercase">Elite</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-lg font-mono tracking-widest text-white/80">•••• •••• •••• 8842</p>
                          <div className="flex justify-between items-end">
                            <p className="text-[10px] font-medium tracking-widest text-white/40 uppercase">Aura Platinum</p>
                            <div className="flex -space-x-2">
                              <div className="h-6 w-6 rounded-full bg-red-500/80" />
                              <div className="h-6 w-6 rounded-full bg-orange-500/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    disabled={isPreOrdered}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isPreOrdered
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-white text-black hover:bg-white/90 active:scale-95"
                      }`}
                  >
                    {isPreOrdered ? (
                      <>
                        <LuCheck className="h-4 w-4" />
                        Reminder Set
                      </>
                    ) : (
                      <>Remind Me</>
                    )}
                  </button>
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
                  <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                </div>
                <Link href="/dashboard/transactions" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                  View All
                </Link>
              </div>

              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">Transaction</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">Asset</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right">Status</th>
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
                              {tx.type}
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
                          {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${tx.status === "Completed" ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"
                            }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-white/20 italic">
                          No recent activity found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pre-order Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-zinc-900 p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              {/* Modal Background Detail */}
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-500/10 blur-[80px] rounded-full" />

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <LuX className="h-6 w-6" />
              </button>

              <div className="relative z-10 text-center">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <LuCreditCard className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Get Card Launch Updates</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-10">
                  Be among the first to experience institutional spending. Join the priority waitlist for the Aura Elite Crypto Bank Card.
                </p>

                {/* Card Preview Small */}
                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 mb-10">
                  <div className="flex items-center gap-4 text-left">
                    <div className="h-12 w-16 bg-zinc-800 rounded-lg border border-white/10 relative overflow-hidden">
                      <div className="absolute top-2 left-2 h-2 w-3 bg-amber-500/50 rounded-sm" />
                      <div className="absolute bottom-2 right-2 flex -space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-500/40" />
                        <div className="h-3 w-3 rounded-full bg-orange-500/40" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Aura Elite Platinum</p>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Priority Status: Active</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsPreOrdered(true);
                      setShowModal(false);
                    }}
                    className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98]"
                  >
                    Remind Me
                  </button>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">No hidden fees • Instant activation upon release</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
