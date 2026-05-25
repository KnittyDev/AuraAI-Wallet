"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { useLanguage } from "@/context/language-context";

export default function TermsPage() {
  const { t } = useLanguage();

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

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">{t("terms.title")}</h1>
          <p className="text-white/60 mb-12">{t("terms.lastUpdated")}</p>

          <section className="space-y-8 text-white/70 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("terms.sec1Title")}</h2>
              <p>
                {t("terms.sec1Desc")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("terms.sec2Title")}</h2>
              <p>
                {t("terms.sec2Desc")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("terms.sec3Title")}</h2>
              <p>
                {t("terms.sec3Desc")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("terms.sec4Title")}</h2>
              <p>
                {t("terms.sec4Desc")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("terms.sec5Title")}</h2>
              <p>
                {t("terms.sec5Desc")}
              </p>
            </div>
          </section>
        </motion.div>
      </main>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <LandingFooter />
      </div>
    </div>
  );
}
