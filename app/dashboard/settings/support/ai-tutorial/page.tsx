"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuZap,
  LuWallet,
  LuActivity,
  LuShield,
  LuArrowLeft,
  LuChevronRight,
  LuPlay,
  LuCircleCheck,
  LuInfo,
  LuBrainCircuit,
  LuTrendingUp
} from "react-icons/lu";
import Link from "next/link";

const tutorialSteps = [
  {
    phase: "Step 1",
    title: "Move Your Money",
    desc: "To start, you need at least $100 in your wallet. Buy Bitcoin or transfer your existing coins (USDT, BTC, ETH) into your Aura Wallet.",
    icon: LuWallet,
    tip: "Tip: If you don't have crypto, just buy Bitcoin and send it to your Aura address."
  },
  {
    phase: "Step 2",
    title: "Pick Your Style",
    desc: "How do you want Aura to work? 'Fast and Risky' for more profit, or 'Slow and Steady' for safety? Pick the style that fits you.",
    icon: LuShield,
    tip: "Aura scans the markets 24/7 to make the best decisions for you."
  },
  {
    phase: "Step 3",
    title: "Just Hit Start",
    desc: "Enter the amount you want to invest and click 'Start'. That’s it! Aura will now handle all the complex trading for you.",
    icon: LuPlay,
    tip: "The system syncs with global exchanges in milliseconds."
  },
  {
    phase: "Step 4",
    title: "Relax & Watch",
    desc: "While Aura works 24/7 without sleep, you can just sit back and watch your profits grow live from your phone.",
    icon: LuActivity,
    tip: "You can download your profit reports as a PDF anytime from your phone."
  },
];

export default function AiTutorialPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-4xl pb-24">
          
          {/* Back Button */}
          <Link href="/dashboard/settings/support">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-xs font-bold uppercase tracking-widest"
            >
              <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Support
              </motion.button>
          </Link>

          {/* Header */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6"
            >
              <LuBrainCircuit className="h-3 w-3 text-white/60" /> Mastering Aura AI
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
            >
              How to Start Your <br />
              AI Trading Journey
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/40 max-w-2xl font-medium leading-relaxed"
            >
              Aura AI is an autonomous neural engine designed to navigate global crypto markets. 
              Follow this step-by-step guide to activate your first strategy.
            </motion.p>
          </div>

          {/* Tutorial Steps */}
          <div className="space-y-12">
            {tutorialSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Step Number Badge */}
                <div className="absolute -left-4 md:-left-12 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Icon & Phase */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors" />
                      <step.icon className="h-8 w-8 text-white relative z-10" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{step.phase}</p>
                      <h3 className="text-xl font-bold text-white mt-1">{step.title}</h3>
                    </div>
                  </div>

                  {/* Right Column: Description & Tip */}
                  <div className="md:col-span-9 p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.01] blur-[60px] rounded-full -mr-24 -mt-24 group-hover:bg-white/[0.03] transition-colors" />
                    
                    <p className="text-white/50 leading-relaxed font-medium mb-6">
                      {step.desc}
                    </p>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <LuInfo className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                      <p className="text-xs text-white/40 italic font-medium">{step.tip}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-12 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />
            
            <div className="relative z-10 space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-bounce">
                <LuTrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Ready to activate Aura?</h2>
              <p className="text-white/40 max-w-sm mx-auto text-sm font-medium">
                Your autonomous AI trading journey is just a few clicks away. Start with a risk profile that fits your goals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/dashboard/investments">
                  <button className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.15)]">
                    Activate First Strategy
                  </button>
                </Link>
                <Link href="/dashboard/settings/support">
                  <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    Still Need Help?
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
