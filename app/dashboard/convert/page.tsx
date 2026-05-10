"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { supabase } from "@/lib/supabase";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuRefreshCw,
  LuArrowDown,
  LuArrowUpRight,
  LuWallet,
  LuInfo,
  LuCircleCheck,
  LuShield,
  LuArrowRight
} from "react-icons/lu";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";
import { useState, useEffect } from "react";
import Link from "next/link";

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", icon: SiBitcoin, id: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", icon: SiEthereum, id: "ethereum" },
  { symbol: "SOL", name: "Solana", icon: SiSolana, id: "solana" },
  { symbol: "USDT", name: "Tether", icon: SiTether, id: "tether" },
];

export default function ConvertPage() {
  const [fromAsset, setFromAsset] = useState(ASSETS[0]);
  const [toAsset, setToAsset] = useState(ASSETS[3]);
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [balanceRes, priceRes] = await Promise.all([
        supabase.from('balances').select('*').eq('user_id', user.id),
        fetch("/api/prices").then(res => res.json())
      ]);

      if (!balanceRes.error) setBalances(balanceRes.data);
      setPrices(priceRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fromBalanceItem = balances.find(b => b.asset_code === fromAsset.symbol);
  const fromBalance = fromBalanceItem ? Number(fromBalanceItem.amount) : 0;

  const fromPrice = prices?.[fromAsset.id]?.usd || 0;
  const toPrice = prices?.[toAsset.id]?.usd || 1;

  const estimatedOutput = amount ? (Number(amount) * fromPrice) / toPrice : 0;
  const rate = fromPrice / toPrice;

  const handleSwap = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setAmount("");
  };

  const executeConversion = async () => {
    if (!amount || Number(amount) <= 0) return;
    if (Number(amount) > Number(fromBalance)) {
      setError("Insufficient balance.");
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      // 1. Subtract from source
      const { error: subError } = await supabase
        .from('balances')
        .update({ amount: Number(fromBalance) - Number(amount) })
        .eq('user_id', user.id)
        .eq('asset_code', fromAsset.symbol);

      if (subError) throw subError;

      // 2. Add to target
      const toBalanceItem = balances.find(b => b.asset_code === toAsset.symbol);
      const currentToBalance = toBalanceItem ? Number(toBalanceItem.amount) : 0;

      const { error: addError } = await supabase
        .from('balances')
        .update({ amount: currentToBalance + estimatedOutput })
        .eq('user_id', user.id)
        .eq('asset_code', toAsset.symbol);

      if (addError) throw addError;

      // 3. Log transactions
      const convId = Math.random().toString(36).substring(2, 8).toUpperCase();

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          type: 'Trade',
          asset: fromAsset.symbol,
          amount: -Number(amount),
          status: 'Completed',
          tx_id: `CONV-${convId}-OUT`
        },
        {
          user_id: user.id,
          type: 'Trade',
          asset: toAsset.symbol,
          amount: estimatedOutput,
          status: 'Completed',
          tx_id: `CONV-${convId}-IN`
        }
      ]);

      setSuccess(true);
      setAmount("");
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/convert" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <LuRefreshCw className={`h-5 w-5 text-white ${isConverting ? "animate-spin" : ""}`} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Convert</h1>
            </div>
            <p className="text-white/50">Instant asset swaps with real-time neural rates.</p>
          </header>

          <div className="space-y-6">
            {/* Convert Card */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl relative">
              <div className="space-y-8">

                {/* From Asset */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">From</label>
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
                      Balance: {fromBalance.toLocaleString()} {fromAsset.symbol}
                    </span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <fromAsset.icon className="h-4 w-4 text-white/60" />
                      </div>
                      <select
                        value={fromAsset.symbol}
                        onChange={(e) => setFromAsset(ASSETS.find(a => a.symbol === e.target.value) || ASSETS[0])}
                        className="bg-transparent text-xl font-semibold text-white outline-none cursor-pointer appearance-none pr-8"
                      >
                        {ASSETS.map(a => <option key={a.symbol} value={a.symbol} className="bg-zinc-900 text-white">{a.symbol}</option>)}
                      </select>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-24 rounded-2xl border border-white/10 bg-black/20 pl-40 pr-8 text-right text-3xl font-medium text-white outline-none focus:border-white/20 focus:bg-black/40 transition-all placeholder:text-white/5"
                    />
                  </div>
                </div>

                {/* Swap Icon */}
                <div className="relative flex justify-center -my-4 z-20">
                  <button
                    onClick={handleSwap}
                    className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <LuArrowDown className="h-6 w-6" />
                  </button>
                </div>

                {/* To Asset */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">To (Estimated)</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <toAsset.icon className="h-4 w-4 text-white/60" />
                      </div>
                      <select
                        value={toAsset.symbol}
                        onChange={(e) => setToAsset(ASSETS.find(a => a.symbol === e.target.value) || ASSETS[3])}
                        className="bg-transparent text-xl font-semibold text-white outline-none cursor-pointer appearance-none pr-8"
                      >
                        {ASSETS.map(a => <option key={a.symbol} value={a.symbol} className="bg-zinc-900 text-white">{a.symbol}</option>)}
                      </select>
                    </div>
                    <div className="w-full h-24 rounded-2xl border border-white/5 bg-white/[0.01] pl-40 pr-8 flex items-center justify-end text-3xl font-medium text-white/50">
                      {estimatedOutput.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </div>
                  </div>
                </div>

                {/* Info & Rate */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40">
                    <LuInfo className="h-4 w-4" />
                    <p className="text-xs font-medium uppercase tracking-widest">Exchange Rate</p>
                  </div>
                  <p className="text-sm font-mono font-bold text-white/80">
                    1 {fromAsset.symbol} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toAsset.symbol}
                  </p>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-400 text-sm font-medium"
                    >
                      <LuShield className="h-5 w-5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-400 text-sm font-medium"
                    >
                      <LuCircleCheck className="h-5 w-5 shrink-0" />
                      Conversion successful! Your balances have been updated.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <button
                  onClick={executeConversion}
                  disabled={isConverting || !amount || Number(amount) <= 0}
                  className="w-full py-6 rounded-2xl bg-white text-black font-bold text-lg hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
                >
                  {isConverting ? (
                    <>
                      <LuRefreshCw className="h-6 w-6 animate-spin" />
                      Processing Swap...
                    </>
                  ) : (
                    <>
                      Confirm Conversion
                      <LuArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hint */}
            <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
              Real-Time Rates
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
  );
}
