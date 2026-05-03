"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { LuArrowRight, LuMonitor, LuPlus, LuFileText, LuChartBar, LuZap, LuMessageSquare, LuShieldCheck } from "react-icons/lu";
import { LandingHeader } from "@/components/landing/landing-header";
import Link from "next/link";
import Image from "next/image";


import auralogo from "@/app/auralogo.png";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Auth Flow */}
        <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-12 z-10 overflow-y-auto">


        <div className="max-w-md w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
              Invest fast, <br />
              <span className="text-white/40">grow faster.</span>
            </h1>
            <p className="text-white/50 text-lg mb-10">
              Analyze in chat, invest with Aura. The intelligence engine for modern portfolios.
            </p>

            <div className="space-y-4">
              {/* Login Card */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                <button className="w-full flex items-center justify-center gap-3 bg-black border border-white/10 rounded-2xl py-3.5 hover:bg-white/5 transition-all group">
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Continue with Google</span>
                </button>

                <div className="relative my-8 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <span className="relative bg-[#0F0F0F] px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">OR</span>
                </div>

                <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                  />
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center bg-white text-black rounded-2xl py-3.5 text-sm font-bold hover:bg-white/90 transition-all"
                  >
                    Continue with email
                  </Link>
                </div>

                <p className="mt-6 text-center text-[10px] text-white/30">
                  By continuing, you acknowledge Aura's <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
                </p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-4 text-white/30 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                <LuMonitor className="h-4 w-4" />
                Download desktop app
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Product Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-[#0D0D0D]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-2xl px-12"
        >
          {/* Main Visual Card */}
          <div className="rounded-[3rem] border border-white/10 bg-white shadow-2xl overflow-hidden aspect-[4/3] flex flex-col p-12">
             <div className="absolute inset-0 opacity-[0.1]" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             {/* Mock Actions Grid */}
             <div className="relative z-10 grid grid-cols-3 gap-4 mb-8">
               {[
                 { icon: LuFileText, label: "Market Report" },
                 { icon: LuChartBar, label: "Crunch Alpha" },
                 { icon: LuZap, label: "Auto-Balance" },

                 { icon: LuShieldCheck, label: "Risk Audit" },
                 { icon: LuMessageSquare, label: "Ask Aura AI" },
                 { icon: LuPlus, label: "New Strategy" }
               ].map((action, i) => (
                 <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-black/5 bg-gray-50/50 transition hover:shadow-md cursor-pointer group">
                   <div className="h-10 w-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-black/40 group-hover:text-cyan-500 transition-colors">
                     <action.icon className="h-5 w-5" />
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-tight text-black/60">{action.label}</span>
                 </div>
               ))}
             </div>

             {/* Mock Chat Input Area */}
             <div className="relative mt-auto">
               <div className="rounded-3xl border border-black/5 bg-gray-50 p-6">
                 <p className="text-sm font-medium text-black/80 mb-6">
                   Summarize the current SOL/USDT trend into a strategy.
                 </p>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-black/10 text-black/60 text-[10px] font-bold">
                       <LuFileText className="h-3 w-3" />
                       SOL_ANALYSIS.PDF
                       <LuPlus className="h-3 w-3 ml-1" />
                    </div>
                    
                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C85C40] text-white text-xs font-bold transition hover:bg-[#B04B32]">
                       Let's go <LuArrowRight className="h-4 w-4" />
                    </button>
                 </div>
               </div>
             </div>
          </div>

          {/* Decorative Floaters */}
          <div className="absolute -top-12 -right-12 h-32 w-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Mobile background elements */}
      <div className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-b from-[#0A0A0A] to-cyan-500/5" />
      </div>
    </div>
  );
}

