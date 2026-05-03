"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Privacy Policy</h1>
          <p className="text-white/60 mb-12">Last Updated: May 2, 2026</p>

          <section className="space-y-8 text-white/70 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">1. Data Collection</h2>
              <p>
                We collect only the data necessary to provide our AI-driven insights. This includes your transaction history (if connected), portfolio balances, and basic account information. We do not sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">2. Use of Information</h2>
              <p>
                Your data is used exclusively to train our AI models on a per-user basis to provide personalized investment strategies and to improve the overall accuracy of the Aura Neural Engine.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">3. Security Measures</h2>
              <p>
                We employ industry-standard encryption for all data at rest and in transit. Access to sensitive data is strictly limited to authorized automated systems within the Aura ecosystem.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">4. Third-Party Integrations</h2>
              <p>
                Aura integrates with various blockchain networks and APIs. These third parties have their own privacy policies, and we recommend reviewing them when connecting your external wallets.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p>
                You have the right to request a copy of your data or its deletion at any time. Processing such requests may take up to 30 days and might result in the suspension of AI-driven features.
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
