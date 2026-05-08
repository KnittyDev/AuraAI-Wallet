"use client";

import Link from "next/link";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuCompass, LuArrowLeft } from "react-icons/lu";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden selection:bg-red-500/30">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-40" />

      <div className="relative z-10 px-6 py-20 flex flex-col items-center text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="h-24 w-24 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
            <LuCompass className="h-12 w-12 text-red-400" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-4"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Signal Lost in the Network
          </h2>
          <p className="text-white/60 font-medium text-lg mb-10 max-w-lg mx-auto">
            The neural pathway you are trying to access doesn't exist or has been relocated. Let's get you back to familiar territory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
          >
            <LuArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Dashboard</span>
          </Link>

          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            Go to Homepage
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
