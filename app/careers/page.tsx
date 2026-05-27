"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuBriefcase,
  LuMapPin,
  LuClock,
  LuArrowRight,
  LuCode,
  LuShieldCheck,
  LuChartBar,
  LuPalette,
  LuUsers,
  LuHeart,
  LuGlobe,
  LuZap,
  LuGraduationCap,
} from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";
import auralogo from "@/app/auralogo.png";
import { useLanguage } from "@/context/language-context";

export default function CareersPage() {
  const { t } = useLanguage();

  const perksList = [
    { icon: LuHeart, title: t("careers.perks.health.title"), desc: t("careers.perks.health.desc") },
    { icon: LuGlobe, title: t("careers.perks.remote.title"), desc: t("careers.perks.remote.desc") },
    { icon: LuZap, title: t("careers.perks.equity.title"), desc: t("careers.perks.equity.desc") },
    { icon: LuGraduationCap, title: t("careers.perks.learning.title"), desc: t("careers.perks.learning.desc") },
  ];

  const positionsList = [
    {
      title: t("careers.openPositions.0.title") || "Senior Blockchain Engineer",
      department: t("careers.departments.engineering"),
      location: t("careers.locations.eu"),
      type: t("careers.types.fullTime"),
      icon: LuCode,
      tags: ["Solidity", "Rust", "EVM"],
    },
    {
      title: t("careers.openPositions.1.title") || "AI/ML Research Engineer",
      department: t("careers.departments.neural"),
      location: t("careers.locations.ch"),
      type: t("careers.types.fullTime"),
      icon: LuChartBar,
      tags: ["Python", "PyTorch", "Transformers"],
    },
    {
      title: t("careers.openPositions.2.title") || "Security Engineer",
      department: t("careers.departments.infra"),
      location: t("careers.locations.global"),
      type: t("careers.types.fullTime"),
      icon: LuShieldCheck,
      tags: ["Pen Testing", "SOC2", "Zero Trust"],
    },
    {
      title: t("careers.openPositions.3.title") || "Product Designer",
      department: t("careers.departments.design"),
      location: t("careers.locations.eu"),
      type: t("careers.types.fullTime"),
      icon: LuPalette,
      tags: ["Figma", "Design Systems", "Motion"],
    },
    {
      title: t("careers.openPositions.4.title") || "Community & Growth Lead",
      department: t("careers.departments.marketing"),
      location: t("careers.locations.global"),
      type: t("careers.types.fullTime"),
      icon: LuUsers,
      tags: ["Web3", "Content Strategy", "Analytics"],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <AuroraBackground />
      <div className="landing-grid-overlay fixed inset-0" />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-8 md:px-10 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src={auralogo} alt="Aura Logo" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-xl tracking-tighter">AuraAI</span>
        </Link>
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
        >
          {t("careers.backHome")}
        </Link>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24">
        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <LuBriefcase className="h-3 w-3" />
            {t("careers.hiringBadge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            {t("careers.heroTitle1")}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-white to-violet-400 bg-clip-text text-transparent">
              {t("careers.heroTitle2")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {t("careers.heroDesc")}
          </motion.p>
        </div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {perksList.map((perk) => (
            <div
              key={perk.title}
              className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-center"
            >
              <div className="h-12 w-12 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 transition-all">
                <perk.icon className="h-5 w-5 text-white/40 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white mb-1">{perk.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Open Positions */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t("careers.positionsTitle")}</h2>
              <p className="mt-1 text-sm text-white/40">{t("careers.positionsDesc").replace("{count}", positionsList.length.toString())}</p>
            </div>
          </div>

          <div className="space-y-4">
            {positionsList.map((pos, idx) => (
              <motion.div
                key={pos.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                className="group p-6 md:p-8 rounded-[1.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 transition-all shrink-0">
                      <pos.icon className="h-5 w-5 text-white/40 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                        {pos.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <LuBriefcase className="h-3 w-3" /> {pos.department}
                        </span>
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <LuMapPin className="h-3 w-3" /> {pos.location}
                        </span>
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <LuClock className="h-3 w-3" /> {pos.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                      {pos.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all">
                      <LuArrowRight className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-16 px-8 rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("careers.noRole.title")}
          </h2>
          <p className="text-white/40 max-w-lg mx-auto mb-8">
            {t("careers.noRole.desc")}
          </p>
          <a
            href="mailto:careers@aurainvest.ai"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all"
          >
            {t("careers.noRole.button")}
            <LuArrowRight className="h-4 w-4" />
          </a>
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em] mt-6">
            careers@aurainvest.ai • Zurich, Switzerland
          </p>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} AuraAI. All rights reserved.</p>
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white transition-colors"
          >
            {t("careers.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
