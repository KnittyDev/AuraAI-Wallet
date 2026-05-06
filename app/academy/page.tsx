"use client";

import { motion, Variants } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuBookOpen, LuCpu, LuShieldCheck, LuUsers, LuArrowRight, LuPlay, LuZap, LuGlobe } from "react-icons/lu";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-50">
        <LandingHeader />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Aura Knowledge Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white mb-8 leading-[1.1]">
              Navigating AI in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 italic">investing together</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed mb-10">
              Master the art of AI-driven capital management. From neural network basics to advanced risk profiling, Aura Academy is your gateway to the future of finance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-sm transition hover:bg-white/90 flex items-center gap-2">
                Get Started for Free <LuArrowRight className="h-4 w-4" />
              </button>
              <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm transition hover:bg-white/10 flex items-center gap-2">
                Explore Curriculum
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white mb-8">
                Our approach to ensuring safe and ethical AI adoption
              </h2>
              <p className="text-white/40 leading-relaxed text-lg mb-8">
                We believe that the power of AI should be accessible yet controlled. Our curriculum focuses on three core pillars: transparency in algorithmic decision-making, risk mitigation through neural feedback, and long-term capital preservation.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <LuShieldCheck className="h-4 w-4 text-cyan-400" /> Secure
                  </h4>
                  <p className="text-sm text-white/30">Rigorous testing on all neural strategies.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <LuCpu className="h-4 w-4 text-purple-400" /> Neural
                  </h4>
                  <p className="text-sm text-white/30">Next-gen AI models for market analysis.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent overflow-hidden"
            >
               <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="w-full h-full rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8">
                    <LuBookOpen className="h-16 w-16 text-white/10 mb-6" />
                    <h3 className="text-2xl font-serif text-white/80 mb-4 italic">Theory of Automated Wealth</h3>
                    <div className="h-px w-20 bg-white/10 mb-6" />
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Module 01 • Introduction</p>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Core Pillars Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: LuZap, title: "Algorithmic Speed", desc: "Understanding execution at scale." },
              { icon: LuUsers, title: "Social Trading", desc: "The impact of collective AI intelligence." },
              { icon: LuGlobe, title: "Global Markets", desc: "Navigating 24/7 financial ecosystems." },
              { icon: LuShieldCheck, title: "Risk Management", desc: "Protecting capital in volatile times." }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon className="h-5 w-5 text-white/40" />
                </div>
                <h3 className="text-white font-bold mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className="relative z-10 py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-serif text-white mb-4 italic">Educational resources</h2>
              <p className="text-white/40 max-w-xl">Deep dive into our whitepapers, tutorials, and strategy guides curated by Aura AI researchers.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors">
              View All Resources <LuArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-[2rem] border border-white/10 bg-zinc-900 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <LuPlay className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Video Lesson</span>
                  </div>
                </div>
                <h4 className="text-xl font-serif text-white group-hover:text-cyan-400 transition-colors mb-2">How neural networks predict market volatility</h4>
                <p className="text-sm text-white/30">An 8-minute masterclass on price action modeling.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />
            <LuBookOpen className="h-12 w-12 text-white/20 mx-auto mb-8 relative z-10" />
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 relative z-10 italic">Ready to master the future?</h2>
            <p className="text-white/40 max-w-2xl mx-auto mb-10 relative z-10">Join 50,000+ investors who are already leveraging Aura AI to enhance their financial literacy.</p>
            <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-sm transition hover:bg-white/90 relative z-10">
              Create Your Student Account
            </button>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
          <div>© 2026 Aura AI Platform • Knowledge is Power</div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Partners</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
