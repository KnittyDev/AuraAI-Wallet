"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Terms of Service</h1>
          <p className="text-white/60 mb-12">Last Updated: May 2, 2026</p>

          <section className="space-y-8 text-white/70 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Aura platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                Aura provides an AI-driven investment assistance platform. We do not provide direct financial advice, and our AI-generated insights are for informational purposes only. All investment decisions remain the sole responsibility of the user.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the security of your account and any API keys provided to the Service. Aura is not liable for any losses resulting from unauthorized access to your account due to negligence on your part.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">4. Risk Disclosure</h2>
              <p>
                Trading cryptocurrencies involves significant risk. Our AI tools are designed to assist, but they cannot guarantee profits or prevent losses. Market volatility can lead to the total loss of invested funds.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Aura shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.
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
