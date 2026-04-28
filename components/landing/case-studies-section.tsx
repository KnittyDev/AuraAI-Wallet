"use client";

import { motion } from "framer-motion";
import { LuQuote, LuArrowRight } from "react-icons/lu";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies-data";

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="mt-24 w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-3">Trusted by Teams</p>
        <h2 className="text-3xl font-bold text-white md:text-5xl tracking-tight">Case Studies</h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-white/40">
          Real portfolio teams using Aura in production environments.
        </p>
      </motion.div>

      {/* Featured - First Case Study (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="group relative mb-6 rounded-[40px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-10 md:p-14 backdrop-blur-xl overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 bg-white/[0.03] blur-[100px] rounded-full" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <LuQuote className="h-8 w-8 text-white/10 mb-6" />
            <p className="text-2xl md:text-3xl font-medium leading-[1.4] text-white/90 mb-10">
              &ldquo;{caseStudies[0].quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/60 border border-white/10">
                {caseStudies[0].initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{caseStudies[0].person}</p>
                <p className="text-xs text-white/40">{caseStudies[0].role}, {caseStudies[0].company}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-10 text-center min-w-[220px]">
              <p className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-2">{caseStudies[0].result}</p>
              <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{caseStudies[0].resultLabel}</p>
            </div>
            <Link
              href={`/studycase/${caseStudies[0].id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold text-white/50 transition hover:text-white hover:bg-white/10"
            >
              Read full case study
              <LuArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Bottom Two - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.slice(1).map((item, i) => (
          <motion.div
            key={item.company}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="group relative rounded-[32px] border border-white/10 bg-white/[0.03] p-8 md:p-10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/20"
          >
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 bg-white/[0.04] blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <LuQuote className="h-6 w-6 text-white/10" />
                <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-center">
                  <p className="text-3xl font-bold tracking-tight text-white">{item.result}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-1">{item.resultLabel}</p>
                </div>
              </div>

              <p className="text-lg font-medium leading-relaxed text-white/80 mb-8">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 border border-white/10">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{item.person}</p>
                    <p className="text-[11px] text-white/30">{item.role}, {item.company}</p>
                  </div>
                </div>

                <Link
                  href={`/studycase/${item.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LuArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
