"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LuTimer, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

export default function CustomerStoriesComingSoon() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">

            Success Stories <br /> Are Coming Soon.
          </h1>
          
          <p className="text-lg text-white/50 leading-relaxed mb-12">
            We are currently documenting the transformative impact Aura AI has had on our institutional partners and private investors. Stay tuned for in-depth case studies and performance breakdowns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all group"
            >
              <LuArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <Link 
              href="/blog"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Read our Blog
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      </main>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <LandingFooter />
      </div>
    </div>
  );
}
