"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowUpRight, 
  LuInfo, 
  LuShieldCheck,
  LuArrowLeft,
  LuWallet,
  LuCircleCheck
} from "react-icons/lu";

import { SiTether, SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ASSETS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: SiBitcoin, balance: 0.42 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: SiEthereum, balance: 5.84 },
  { id: "solana", name: "Solana", symbol: "SOL", icon: SiSolana, balance: 142.5 },
  { id: "tether", name: "Tether", symbol: "USDT", icon: SiTether, balance: 12450.00 },
];

const NETWORKS: Record<string, { id: string; name: string; fee: string; time: string }[]> = {
  tether: [
    { id: "trc20", name: "TRX (TRC20)", fee: "1 USDT", time: "2 mins" },
    { id: "erc20", name: "ETH (ERC20)", fee: "12 USDT", time: "5 mins" },
    { id: "bep20", name: "BSC (BEP20)", fee: "0.8 USDT", time: "2 mins" },
  ],
  bitcoin: [{ id: "btc", name: "Bitcoin", fee: "FREE", time: "30 mins" }],
  ethereum: [{ id: "erc20", name: "Ethereum", fee: "0.003 ETH", time: "5 mins" }],
  solana: [{ id: "sol", name: "Solana", fee: "0.01 SOL", time: "1 min" }],
};

export default function WithdrawPage() {
  const [balances, setBalances] = useState<Record<string, number>>({ USDT: 0, BTC: 0, ETH: 0, SOL: 0 });
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[3]); // Default to USDT
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[selectedAsset.id][0]);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalances() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('balances')
        .select('asset_code, amount')
        .eq('user_id', user.id);

      if (data) {
        const balMap: Record<string, number> = { USDT: 0, BTC: 0, ETH: 0, SOL: 0 };
        data.forEach(b => {
          balMap[b.asset_code] = Number(b.amount);
        });
        setBalances(balMap);
      }
    }
    fetchBalances();
  }, []);

  const handleAssetChange = (asset: typeof ASSETS[0]) => {
    setSelectedAsset(asset);
    setSelectedNetwork(NETWORKS[asset.id][0]);
    setError(null);
  };

  const handleWithdraw = async () => {
    if (!address || address.length < 10) {
      setError("Please enter a valid withdrawal address.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    
    const currentBalance = balances[selectedAsset.symbol] || 0;
    if (Number(amount) > currentBalance) {
      setError("Insufficient balance.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // 1. Deduct from balances
      const { error: balanceError } = await supabase
        .from('balances')
        .update({ amount: currentBalance - Number(amount) })
        .eq('user_id', user.id)
        .eq('asset_code', selectedAsset.symbol);

      if (balanceError) throw balanceError;

      // 2. Insert Pending Transaction
      const txHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'Withdrawal',
          asset: selectedAsset.symbol,
          amount: -Number(amount),
          status: 'Processing',
          address: address,
          network: selectedNetwork.name,
          tx_id: txHash
        });

      if (transactionError) throw transactionError;

      // 3. Send Email Notification
      try {
        // Fetch email from profiles table as requested
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        const emailToUse = profile?.email || user.email;

        await fetch('/api/notifications/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailToUse,
            amount: amount,
            asset: selectedAsset.symbol,
            address: address,
            network: selectedNetwork.name,
            txId: txHash
          })
        });
      } catch (emailErr) {
        console.error("Failed to send notification email:", emailErr);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while processing withdrawal.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
    <main className="min-h-screen bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/withdraw" />
        
        <section className="flex-1 flex items-center justify-center p-6 lg:ml-72 min-w-0 max-w-[100vw]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 backdrop-blur-2xl text-center"
          >
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mx-auto mb-6">
              <LuCircleCheck className="h-10 w-10 text-emerald-400" />
            </div>

            <h2 className="text-3xl font-bold mb-2">Withdrawal Initiated</h2>
            <p className="text-white/50 mb-8">
              Your request to withdraw {amount} {selectedAsset.symbol} is currently in processing. 
              You will receive a notification once the transaction is confirmed on the network.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/wallet" className="block w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all">
                Back to Wallet
              </Link>
              <Link href="/dashboard/transactions" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-sm">
                View Transactions
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/withdraw" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <LuArrowUpRight className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Withdraw Assets</h1>
            </div>
            <p className="text-white/50 ml-13">Securely transfer your funds to an external wallet.</p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Asset Selection */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 block">1. Select Asset</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ASSETS.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleAssetChange(asset)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedAsset.id === asset.id 
                        ? "bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                        : "border-white/5 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <asset.icon className={`h-6 w-6 text-white/60`} />
                      <span className="text-xs font-medium text-white/80">{asset.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Selection */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 block">2. Network</label>
                <div className="space-y-3">
                  {NETWORKS[selectedAsset.id].map((network) => (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedNetwork.id === network.id 
                        ? "border-white bg-white/10" 
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-sm text-white">{network.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Fee: {network.fee} • {network.time}</p>
                      </div>
                      {selectedNetwork.id === network.id && <LuCircleCheck className="h-4 w-4 text-white" />}

                    </button>
                  ))}
                </div>
              </div>

              {/* Address & Amount */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md space-y-6">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 block">3. Destination Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={`Enter ${selectedAsset.name} address`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-mono text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">4. Amount</label>
                    <button 
                      onClick={() => setAmount((balances[selectedAsset.symbol] || 0).toString())}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                    >
                      Max: {balances[selectedAsset.symbol] || 0} {selectedAsset.symbol}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all text-2xl font-medium"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 font-bold tracking-widest uppercase text-xs">
                      {selectedAsset.symbol}
                    </span>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className={`w-full py-5 rounded-2xl font-bold text-black transition-all ${
                    isLoading ? "bg-white/50 cursor-not-allowed" : "bg-white hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isLoading ? "Processing Request..." : "Confirm Withdrawal"}
                </button>
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 md:p-10 backdrop-blur-xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <LuInfo className="h-5 w-5 text-cyan-400" />
                  Security Protocol
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                      <LuShieldCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Double Verification</p>
                      <p className="text-xs text-white/40 leading-relaxed">Each withdrawal is checked against institutional risk patterns to ensure your funds remain safe.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                      <LuWallet className="h-3 w-3 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Cold Storage Access</p>
                      <p className="text-xs text-white/40 leading-relaxed">Large withdrawals may require up to 24 hours for manual review from secure cold-storage vaults.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-10 p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4 text-center">Summary</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Withdrawal Amount</span>
                      <span className="text-white">{amount || "0.00"} {selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Network Fee</span>
                      <span className="text-white">{selectedNetwork.fee}</span>
                    </div>
                    <div className="h-px bg-white/10 w-full my-2" />
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-white">Receive Amount</span>
                      <span className="text-cyan-400">
                        {amount && selectedNetwork 
                          ? (Number(amount) - (selectedNetwork.fee === "FREE" ? 0 : parseFloat(selectedNetwork.fee))).toFixed(selectedAsset.symbol === "BTC" ? 8 : 2) 
                          : "0.00"} {selectedAsset.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  );
}
