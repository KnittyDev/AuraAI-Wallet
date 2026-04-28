"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowDownCircle, 
  LuCopy, 
  LuCheck, 
  LuInfo, 
  LuChevronDown, 
  LuShieldCheck,
  LuExternalLink
} from "react-icons/lu";
import { SiTether, SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";
import { QRCodeSVG } from "qrcode.react";

const ASSETS = [
  { id: "usdt", name: "Tether", code: "USDT", icon: SiTether },
  { id: "btc", name: "Bitcoin", code: "BTC", icon: SiBitcoin },
  { id: "eth", name: "Ethereum", code: "ETH", icon: SiEthereum },
  { id: "sol", name: "Solana", code: "SOL", icon: SiSolana },
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

const ADDRESSES: Record<string, string> = {
  trc20: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  erc20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  bep20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  sol: "4j3W6k6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r",
};

export default function DepositPage() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[selectedAsset.id][0]);
  const [copied, setCopied] = useState(false);

  const handleAssetChange = (asset: typeof ASSETS[0]) => {
    setSelectedAsset(asset);
    setSelectedNetwork(NETWORKS[asset.id][0]);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(ADDRESSES[selectedNetwork.id]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <DashboardSidebar currentPath="/dashboard/deposit" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Deposit Assets</h1>
            <p className="text-white/50">Fund your account to start AI-powered trading.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Selection Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Asset Selection */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4 block">1. Select Asset</label>
                <div className="grid grid-cols-2 gap-3">
                  {ASSETS.map((asset) => {
                    const Icon = asset.icon;
                    const isSelected = selectedAsset.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => handleAssetChange(asset)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? "border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                          : "border-white/5 bg-white/5 hover:border-white/20"
                        }`}
                      >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isSelected ? "bg-white/10 text-white" : "bg-white/5 text-white/40"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`font-medium transition-colors duration-300 ${isSelected ? "text-white" : "text-white/60"}`}>
                        {asset.code}
                      </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Network Selection */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4 block">2. Select Network</label>
                <div className="space-y-2">
                  {NETWORKS[selectedAsset.id].map((network) => {
                    const isSelected = selectedNetwork.id === network.id;
                    return (
                      <button
                        key={network.id}
                        onClick={() => setSelectedNetwork(network)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? "border-white bg-white/10" 
                          : "border-white/5 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-medium">{network.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Est. {network.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/60">Fee: {network.fee}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <LuInfo className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Ensure you select the same network on the sending platform. Sending via wrong network may result in permanent loss of funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Address Column */}
            <div className="lg:col-span-7">
              <div className="h-full rounded-[40px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-transparent p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <LuShieldCheck className="h-24 w-24 text-white/5 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-2">Deposit Address</p>
                    <h3 className="text-2xl font-semibold text-white">Your {selectedAsset.name} Address</h3>
                  </div>

                  {/* QR Code */}
                  <div className="mx-auto mb-10 p-6 rounded-3xl bg-white flex items-center justify-center w-64 h-64 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <QRCodeSVG
                      value={ADDRESSES[selectedNetwork.id]}
                      size={200}
                      level={"H"}
                      includeMargin={false}
                      imageSettings={{
                        src: "/auralogo.png",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                      }}
                    />
                  </div>

                  <div className="mt-auto">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                      <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Copy to clipboard</p>
                          <p className="text-sm font-mono text-white break-all">{ADDRESSES[selectedNetwork.id]}</p>
                        </div>
                        <button 
                          onClick={copyAddress}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black transition hover:scale-105 active:scale-95 shrink-0"
                        >
                          {copied ? <LuCheck className="h-5 w-5" /> : <LuCopy className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                        <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-1">Minimum Deposit</p>
                        <p className="text-sm font-medium text-white">10 {selectedAsset.code}</p>
                      </div>
                      <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                        <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-1">Confirmations</p>
                        <p className="text-sm font-medium text-white">
                          {selectedNetwork.id === "trc20" ? "1" : "12"} Block
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition group">
                        <span>View on Block Explorer</span>
                        <LuExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
