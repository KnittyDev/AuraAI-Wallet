"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuCreditCard, LuShieldCheck, LuGlobe, LuZap, LuArrowLeft, LuCheck, LuSparkles } from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";
import { useState } from "react";

const CARD_FEATURES = [
  {
    icon: LuGlobe,
    title: "Spend Anywhere",
    description: "Accepted at 80M+ merchants worldwide. Pay with crypto as easily as a regular card."
  },
  {
    icon: LuZap,
    title: "Instant Conversion",
    description: "Your crypto is automatically converted at the best rate at the moment of purchase."
  },
  {
    icon: LuShieldCheck,
    title: "Zero Hidden Fees",
    description: "No monthly fees, no conversion markup. Just transparent, honest pricing."
  },
  {
    icon: LuSparkles,
    title: "3% Cashback",
    description: "Earn cashback in your preferred cryptocurrency on every transaction you make."
  }
];

const CARD_TIERS = [
  { name: "Standard", limit: "$10,000/mo", cashback: "1%", color: "from-zinc-900 to-black", accent: "text-white/60", accentBg: "bg-white/5 border-white/10 text-white/60", chipColor: "from-white/15 to-white/5" },
  { name: "Elite", limit: "$50,000/mo", cashback: "2%", color: "from-blue-800 to-blue-950", accent: "text-blue-400", accentBg: "bg-blue-400/10 border-blue-400/20 text-blue-400", chipColor: "from-blue-300/30 to-blue-500/20" },
  { name: "Platinum", limit: "Unlimited", cashback: "3%", color: "from-amber-600/80 to-amber-900", accent: "text-amber-300", accentBg: "bg-amber-400/10 border-amber-400/20 text-amber-300", chipColor: "from-amber-300/40 to-amber-500/20" },
];

export default function CardPage() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [isWaitlisted, setIsWaitlisted] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/wallet" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-5xl">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <LuArrowLeft className="h-4 w-4" />
              Back to Wallet
            </Link>
          </motion.div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  Coming Soon
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Aura Elite<br />
                <span className="text-white/30">Crypto Card</span>
              </h1>
              <p className="text-lg text-white/40 leading-relaxed max-w-md">
                The world's most premium crypto bank card. Spend your digital assets anywhere, anytime — with zero fees and institutional-grade security.
              </p>

              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsWaitlisted(true)}
                  disabled={isWaitlisted}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                    isWaitlisted
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  {isWaitlisted ? (
                    <>
                      <LuCheck className="h-5 w-5" />
                      You're on the list
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </motion.button>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  2,847 waiting
                </span>
              </div>
            </motion.div>

            {/* Right: 3D Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-[420px] aspect-[1.586/1] group perspective-[1000px]">
                {/* Card Shadow */}
                <div className="absolute inset-4 bg-white/5 blur-[40px] rounded-3xl" />
                
                {/* Physical Card */}
                <motion.div
                  whileHover={{ rotateY: 8, rotateX: -4, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative w-full h-full bg-gradient-to-br from-zinc-800 to-black rounded-3xl border border-white/15 shadow-2xl flex flex-col justify-between p-8 cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Holographic Shimmer */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>

                  {/* Card Chip */}
                  <div className="absolute top-[40%] left-8 h-8 w-11 rounded-md bg-gradient-to-br from-amber-300/40 to-amber-600/30 border border-amber-500/20" />

                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Image src={auraLogo} alt="Aura Logo" width={28} height={28} className="rounded-lg" />
                      <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">Aura</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold tracking-[0.3em] text-white/40 uppercase">Elite</p>
                    </div>
                  </div>

                  <div className="space-y-5 mt-auto">
                    <p className="text-xl font-mono tracking-[0.3em] text-white/70">•••• •••• •••• 8842</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] font-bold tracking-[0.2em] text-white/30 uppercase mb-1">Card Holder</p>
                        <p className="text-xs font-bold tracking-widest text-white/70 uppercase">Aura Platinum Member</p>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="h-7 w-7 rounded-full bg-red-500/80" />
                        <div className="h-7 w-7 rounded-full bg-orange-500/80" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Why Aura Card?
              </h2>
              <p className="text-white/30 max-w-lg mx-auto">
                Built for the next generation of digital asset holders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CARD_FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <feature.icon className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Card Tiers */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Choose Your Tier
              </h2>
              <p className="text-white/30 max-w-lg mx-auto">
                Select the card that matches your ambition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CARD_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedTier(i)}
                  className={`rounded-[2rem] border p-8 transition-all cursor-pointer relative overflow-hidden ${
                    selectedTier === i
                      ? "border-white/20 bg-white/[0.04]"
                      : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                  }`}
                >
                  {selectedTier === i && (
                    <motion.div
                      layoutId="tier-highlight"
                      className="absolute inset-0 border-2 border-white/10 rounded-[2rem] pointer-events-none"
                    />
                  )}

                  {/* Mini Card Preview */}
                  <div className={`w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${tier.color} border border-white/10 mb-8 p-4 flex flex-col justify-between relative overflow-hidden`}>
                    {/* Chip */}
                    <div className={`absolute top-[45%] left-4 h-5 w-7 rounded-sm bg-gradient-to-br ${tier.chipColor} border border-white/10`} />
                    <div className="flex items-center gap-1.5">
                      <Image src={auraLogo} alt="Aura" width={14} height={14} className="rounded-sm" />
                      <span className="text-[7px] font-bold tracking-[0.2em] text-white/70 uppercase">Aura</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-mono tracking-widest text-white/40">•••• 8842</p>
                      <span className={`text-[7px] font-bold tracking-[0.15em] uppercase ${tier.accent}`}>{tier.name}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{tier.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/30">Monthly Limit</span>
                      <span className="text-white font-bold">{tier.limit}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/30">Cashback</span>
                      <span className={`font-bold ${tier.accent}`}>{tier.cashback}</span>
                    </div>
                  </div>

                  {selectedTier === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${tier.accentBg}`}>
                        <LuCheck className="h-3 w-3" />
                        Selected
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] border border-white/10 bg-white/[0.02] p-12 md:p-16 text-center mb-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <LuCreditCard className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
                Ready to spend crypto?
              </h2>
              <p className="text-white/40 max-w-md mx-auto mb-10">
                Join thousands of Aura members waiting for the future of payments.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWaitlisted(true)}
                disabled={isWaitlisted}
                className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 mx-auto ${
                  isWaitlisted
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isWaitlisted ? (
                  <>
                    <LuCheck className="h-5 w-5" />
                    You're on the waitlist
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </motion.button>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold mt-4">
                No fees • Priority access • Exclusive perks
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  </main>
  );
}
