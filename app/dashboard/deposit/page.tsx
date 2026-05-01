"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowDown, 
  LuInfo, 
  LuShieldCheck,
  LuCopy,
  LuCheck,
  LuExternalLink,
  LuArrowLeft
} from "react-icons/lu";
import { SiTether, SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";
import { QRCodeSVG } from "qrcode.react";

const ASSETS = [
  { id: "usdt", name: "Tether", code: "USDT", icon: SiTether, color: "text-[#26A17B]", bgHover: "hover:bg-[#26A17B]/10", borderActive: "border-[#26A17B]/50", glow: "shadow-[0_0_30px_rgba(38,161,123,0.3)]" },
  { id: "btc", name: "Bitcoin", code: "BTC", icon: SiBitcoin, color: "text-[#F7931A]", bgHover: "hover:bg-[#F7931A]/10", borderActive: "border-[#F7931A]/50", glow: "shadow-[0_0_30px_rgba(247,147,26,0.3)]" },
  { id: "eth", name: "Ethereum", code: "ETH", icon: SiEthereum, color: "text-[#627EEA]", bgHover: "hover:bg-[#627EEA]/10", borderActive: "border-[#627EEA]/50", glow: "shadow-[0_0_30px_rgba(98,126,234,0.3)]" },
  { id: "sol", name: "Solana", code: "SOL", icon: SiSolana, color: "text-[#14F195]", bgHover: "hover:bg-[#14F195]/10", borderActive: "border-[#14F195]/50", glow: "shadow-[0_0_30px_rgba(20,241,149,0.3)]" },
];

const NETWORKS: Record<string, { id: string; name: string; fee: string; time: string }[]> = {
  usdt: [
    { id: "trc20", name: "TRX (TRC20)", fee: "1 USDT", time: "2 mins" },
    { id: "erc20", name: "ETH (ERC20)", fee: "5 USDT", time: "5 mins" },
    { id: "bep20", name: "BSC (BEP20)", fee: "0.5 USDT", time: "2 mins" },
  ],
  btc: [{ id: "btc", name: "Bitcoin", fee: "0.0005 BTC", time: "30 mins" }],
  eth: [{ id: "erc20", name: "Ethereum", fee: "0.002 ETH", time: "5 mins" }],
  sol: [{ id: "sol", name: "Solana", fee: "0.01 SOL", time: "1 min" }],
};

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


export default function DepositPage() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[selectedAsset.id][0]);
  const [amount, setAmount] = useState<string>("100");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [depositData, setDepositData] = useState<{
    address: string;
    expectedAmount: string;
    orderId: string;
    currency?: string;
  } | null>(null);

  const handleAssetChange = (asset: typeof ASSETS[0]) => {
    setSelectedAsset(asset);
    setSelectedNetwork(NETWORKS[asset.id][0]);
    setDepositData(null);
  };

  const copyAddress = () => {
    if (depositData?.address) {
      navigator.clipboard.writeText(depositData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(amount), 
          currency: "USD",
          network: selectedNetwork.id,
          assetId: selectedAsset.id
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setDepositData({
          address: data.address,
          expectedAmount: data.expectedAmount,
          orderId: data.orderId,
          currency: data.currency
        });
      } else {
        setError(data.error || "Failed to generate deposit address.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <DashboardSidebar currentPath="/dashboard/deposit" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <LuArrowDown className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Deposit Assets</h1>
            </div>
            <p className="text-white/50 ml-13">Fund your account securely.</p>
          </motion.header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Selection Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Asset Selection */}
              <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 block flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white text-[8px]">1</span>
                  Select Preferred Asset
                </label>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {ASSETS.map((asset) => {
                    const Icon = asset.icon;
                    const isSelected = selectedAsset.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => handleAssetChange(asset)}
                        disabled={!!depositData}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? `bg-white/10 ${asset.borderActive} ${asset.glow}` 
                          : `border-white/5 bg-white/5 ${asset.bgHover} hover:border-white/20`
                        } ${depositData ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                          isSelected ? "bg-white text-black scale-110 shadow-lg" : `bg-white/5 ${asset.color}`
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`font-medium text-sm transition-colors duration-300 ${isSelected ? "text-white" : "text-white/60"}`}>
                          {asset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Network Selection */}
              <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 block flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white text-[8px]">2</span>
                  Select Network Preference
                </label>
                <div className="space-y-3 relative z-10">
                  {NETWORKS[selectedAsset.id].map((network) => {
                    const isSelected = selectedNetwork.id === network.id;
                    return (
                      <button
                        key={network.id}
                        onClick={() => {
                          setSelectedNetwork(network);
                          setDepositData(null);
                        }}
                        disabled={!!depositData}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                          isSelected 
                          ? `border-white bg-white/10 ${selectedAsset.glow}` 
                          : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                        } ${depositData ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "border-white" : "border-white/20"
                          }`}>
                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <div className="text-left">
                            <p className={`font-medium ${isSelected ? "text-white" : "text-white/80"}`}>{network.name}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Est. {network.time}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Payment Setup Column */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <div className="h-full rounded-[40px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-transparent p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                  <LuShieldCheck className="h-48 w-48 text-white/10 rotate-12" />
                </div>
                <div className={`absolute -inset-20 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl rounded-full transition-opacity duration-1000 ${selectedAsset.glow.replace("shadow", "bg")}`} style={{ opacity: 0.1 }} />

                <div className="relative z-10 flex flex-col items-center">
                  {!depositData ? (
                    <>
                      <div className="mb-8 text-center">
                        <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Checkout Details</p>
                        <h3 className="text-3xl font-semibold text-white">Deposit Amount</h3>
                      </div>

                      <div className="w-full max-w-md space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">Amount in USD</label>
                          <div className="relative group">
                            <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500 ${selectedAsset.glow.replace("shadow-", "bg-")}`} />
                            <div className="relative flex items-center px-4 py-1 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-md">
                              <span className="text-white/40 text-xl font-medium">$</span>
                              <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="10"
                                className="w-full bg-transparent border-none text-white text-2xl font-medium focus:outline-none focus:ring-0 px-3 py-3"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>

                        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white/60">Selected Asset</span>
                            <span className="text-white font-medium flex items-center gap-2">
                              <selectedAsset.icon className={`h-4 w-4 ${selectedAsset.color}`} />
                              {selectedAsset.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white/60">Selected Network</span>
                            <span className="text-white font-medium">{selectedNetwork.name}</span>
                          </div>
                          <div className="h-px w-full bg-white/10" />
                          <div className="flex justify-between items-center text-base">
                            <span className="text-white/80 font-medium">Total to Pay</span>
                            <span className="text-white font-bold tracking-wider">${amount || "0.00"}</span>
                          </div>
                        </div>

                        <button
                          onClick={handlePayment}
                          disabled={isLoading}
                          className={`w-full py-4 rounded-xl font-bold text-black transition-all duration-300 relative overflow-hidden group ${
                            isLoading ? "bg-white/50 cursor-not-allowed" : "bg-white hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]`} />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                              <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                              <>
                                <LuShieldCheck className="h-5 w-5" />
                                Generate Deposit Address
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-col items-center"
                    >
                      <button 
                        onClick={() => setDepositData(null)}
                        className="self-start flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition group mb-6"
                      >
                        <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to amount
                      </button>

                      <div className="mb-8 text-center">
                        <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Send Funds</p>
                        <h3 className="text-3xl font-semibold text-white">Your {selectedAsset.name} Address</h3>
                      </div>

                      <div className="relative mb-8 group">
                        <div className={`absolute -inset-4 rounded-[40px] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${selectedAsset.glow.replace("shadow-", "shadow-")}`} />
                        <div className="relative p-6 rounded-3xl bg-white flex items-center justify-center w-[240px] h-[240px] shadow-2xl transform transition-transform group-hover:scale-105 duration-300">
                          <QRCodeSVG
                            value={depositData.address}
                            size={192}
                            level={"H"}
                            includeMargin={false}
                            imageSettings={{
                              src: "/auralogo.png",
                              x: undefined,
                              y: undefined,
                              height: 48,
                              width: 48,
                              excavate: true,
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full max-w-md">
                        <div className="flex justify-between items-center px-2 mb-2">
                          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Amount to Send</p>
                          <p className="text-sm font-bold text-white">{depositData.expectedAmount} {depositData.currency || selectedAsset.code}</p>

                        </div>
                        <div className="relative group mb-6">
                          <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500 ${selectedAsset.glow.replace("shadow-", "bg-")}`} />
                          <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-md">
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-1">Deposit Address</p>
                              <p className="text-sm font-mono text-white truncate">{depositData.address}</p>
                            </div>
                            <button 
                              onClick={copyAddress}
                              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 active:scale-95 shrink-0 ${
                                copied ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-white/90"
                              }`}
                            >
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={copied ? "check" : "copy"}
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  {copied ? <LuCheck className="h-5 w-5" /> : <LuCopy className="h-5 w-5" />}
                                </motion.div>
                              </AnimatePresence>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm text-center">
                            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Network</p>
                            <p className="text-sm font-medium text-white">{selectedNetwork.name}</p>
                          </div>
                          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm text-center">
                            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Order ID</p>
                            <p className="text-xs font-mono text-white/70">{depositData.orderId}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
