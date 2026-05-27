"use client";

import { motion, Variants } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuBookOpen, LuCpu, LuShieldCheck, LuUsers, LuArrowRight, LuPlay, LuZap, LuGlobe } from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

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
  const { t } = useLanguage();

  const corePillars = [
    { icon: LuZap, title: t("academy.pillars.p1Title"), desc: t("academy.pillars.p1Desc") },
    { icon: LuUsers, title: t("academy.pillars.p2Title"), desc: t("academy.pillars.p2Desc") },
    { icon: LuGlobe, title: t("academy.pillars.p3Title"), desc: t("academy.pillars.p3Desc") },
    { icon: LuShieldCheck, title: t("academy.pillars.p4Title"), desc: t("academy.pillars.p4Desc") }
  ];

  const lessonCards = [
    { id: 1, title: t("academy.resources.lessonTitle"), desc: t("academy.resources.lessonDesc") },
    { id: 2, title: t("academy.resources.lessonTitle"), desc: t("academy.resources.lessonDesc") },
    { id: 3, title: t("academy.resources.lessonTitle"), desc: t("academy.resources.lessonDesc") }
  ];

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
              {t("academy.hero.badge")}
            </div>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white mb-8 leading-[1.1]">
              {t("academy.hero.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 italic">{t("academy.hero.title2")}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed mb-10">
              {t("academy.hero.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-sm transition hover:bg-white/90 flex items-center gap-2">
                {t("academy.hero.cta1")} <LuArrowRight className="h-4 w-4" />
              </button>
              <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm transition hover:bg-white/10 flex items-center gap-2">
                {t("academy.hero.cta2")}
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
                {t("academy.philosophy.title")}
              </h2>
              <p className="text-white/40 leading-relaxed text-lg mb-8">
                {t("academy.philosophy.desc")}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <LuShieldCheck className="h-4 w-4 text-cyan-400" /> {t("academy.philosophy.secureTitle")}
                  </h4>
                  <p className="text-sm text-white/30">{t("academy.philosophy.secureDesc")}</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <LuCpu className="h-4 w-4 text-purple-400" /> {t("academy.philosophy.neuralTitle")}
                  </h4>
                  <p className="text-sm text-white/30">{t("academy.philosophy.neuralDesc")}</p>
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
                    <h3 className="text-2xl font-serif text-white/80 mb-4 italic">{t("academy.philosophy.moduleTitle")}</h3>
                    <div className="h-px w-20 bg-white/10 mb-6" />
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{t("academy.philosophy.moduleSubtitle")}</p>
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
            {corePillars.map((pillar, i) => (
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
              <h2 className="text-4xl font-serif text-white mb-4 italic">{t("academy.resources.title")}</h2>
              <p className="text-white/40 max-w-xl">{t("academy.resources.desc")}</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors">
              {t("academy.resources.viewAll")} <LuArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lessonCards.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-[2rem] border border-white/10 bg-zinc-900 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <LuPlay className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t("academy.resources.videoLesson")}</span>
                  </div>
                </div>
                <h4 className="text-xl font-serif text-white group-hover:text-cyan-400 transition-colors mb-2">{item.title}</h4>
                <p className="text-sm text-white/30">{item.desc}</p>
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
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 relative z-10 italic">{t("academy.cta.title")}</h2>
            <p className="text-white/40 max-w-2xl mx-auto mb-10 relative z-10">{t("academy.cta.desc")}</p>
            <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-sm transition hover:bg-white/90 relative z-10">
              {t("academy.cta.button")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
          <div>{t("academy.footer.copy")}</div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">{t("academy.footer.link1")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("academy.footer.link2")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("academy.footer.link3")}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
