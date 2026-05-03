"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuWallet, 
  LuArrowUpRight, 
  LuArrowDownLeft, 
  LuHistory, 
  LuSettings,
  LuTrendingUp,
  LuShieldCheck
} from "react-icons/lu";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();
        setPrices(data);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const assetsWithPrices = INITIAL_ASSETS.map((asset) => {
    const priceData = prices?.[asset.id];
    const usdValue = priceData ? asset.balance * priceData.usd : 0;
    return {
      ...asset,
      price: priceData?.usd || 0,
      change: priceData?.usd_24h_change?.toFixed(2) || "0.00",
      value: usdValue,
    };
  });

  const totalBalance = assetsWithPrices.reduce((acc, asset) => acc + asset.value, 0);

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
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                <LuArrowUpRight className="h-4 w-4" />
                Withdraw
              </button>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Balance Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <LuShieldCheck className="h-48 w-48 text-white rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4 flex items-center gap-2">
                  Total Net Worth
                  {loading && <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
                  {!loading && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Live</span>}
                </div>

                <div className="flex items-baseline gap-4 mb-8">
                  <h2 className="text-6xl font-medium tracking-tight text-white">
                    ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBalance)}
                  </h2>
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

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 flex flex-col gap-4"
            >
              <div className="flex-1 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-8 backdrop-blur-md">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">AI Insight</p>
                <p className="text-sm leading-relaxed text-white/70">
                  Real-time market analysis active. 
                  {assetsWithPrices[2].change > "10" ? (
                    <>Your Solana position has increased significantly. Aura AI recommends a partial rebalance.</>
                  ) : (
                    <>Portfolio optimization in progress. Current allocations are within institutional risk parameters.</>
                  )}
                </p>
                <button className="mt-6 w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                  Optimize Now
                </button>
              </div>
            </motion.div>

            {/* Assets List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-12"
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xl font-semibold text-white">Asset Breakdown</h3>
                <button className="text-white/40 hover:text-white transition-colors">
                  <LuSettings className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        Number(asset.change) >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
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
            </motion.div>


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
                    {TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                              tx.type === "deposit" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                            }`}>
                              {tx.type === "deposit" ? <LuArrowDownLeft className="h-4 w-4" /> : <LuArrowUpRight className="h-4 w-4" />}
                            </div>
                            <span className="text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                              {tx.type === "deposit" ? "Deposit" : "Withdrawal"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-white/70">{tx.asset}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-sm font-mono font-bold ${
                            tx.type === "deposit" ? "text-emerald-400" : "text-white"
                          }`}>{tx.amount}</span>
                        </td>
                        <td className="px-8 py-5 text-sm text-white/40">{tx.date}</td>
                        <td className="px-8 py-5 text-right">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                            tx.status === "Completed" ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
