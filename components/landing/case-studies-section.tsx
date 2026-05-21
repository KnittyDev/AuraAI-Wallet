"use client";

import { motion } from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
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
        <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-3">
          Proven Outcomes
        </p>
        <h2 className="text-3xl font-bold text-white md:text-5xl tracking-tight">
          Case Studies
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-white/40">
          Real portfolio teams using Aura to optimize autonomous trade operations in production.
        </p>
      </motion.div>

      {/* Basic & Minimalist 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caseStudies.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
          >
            <div>
              {/* Header: Company & Badge */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="text-sm font-semibold text-white/90">
                  {item.company}
                </span>
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] font-bold text-white/40 tracking-wider uppercase">
                  {item.tag}
                </span>
              </div>

              {/* Metric Result */}
              <div className="mb-6">
                <p className="text-4xl font-bold tracking-tight text-white mb-1">
                  {item.result}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                  {item.resultLabel}
                </p>
              </div>

              {/* Minimal Quote */}
              <p className="text-sm text-white/70 leading-relaxed italic mb-8 border-l border-white/10 pl-4">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Footer Section */}
            <div className="border-t border-white/5 pt-6">
              <div className="mb-5">
                <p className="text-xs font-semibold text-white/80">{item.person}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{item.role}</p>
              </div>

              <Link
                href={`/studycase/${item.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-all group/btn"
              >
                <span>Read full case study</span>
                <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

