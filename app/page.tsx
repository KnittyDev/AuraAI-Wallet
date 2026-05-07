import { AuroraBackground } from "@/components/landing/aurora-background";
import { BrandMarquee } from "@/components/landing/brand-marquee";
import { CaseStudiesSection } from "@/components/landing/case-studies-section";
import { FeatureShowcaseSection } from "@/components/landing/feature-showcase-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingSection } from "@/components/landing/pricing-section";
import { PromptCard } from "@/components/landing/prompt-card";
import { QuestionsSection } from "@/components/landing/questions-section";
import { RealResultsSection } from "@/components/landing/real-results-section";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-white/10 selection:text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 border-b border-white/5 bg-black/20 backdrop-blur-xl -z-10 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-8 md:px-10">
        <section className="mx-auto mt-16 flex w-full max-w-6xl flex-1 flex-col items-center text-center md:mt-20">
          <LandingHero />
          <PromptCard />
          <BrandMarquee />
          <div id="pricing" className="w-full">
            <PricingSection />
          </div>
          <div id="features" className="w-full">
            <FeatureShowcaseSection />
          </div>
          <div id="results" className="w-full">
            <RealResultsSection />
          </div>
          <div id="case-studies" className="w-full">
            <CaseStudiesSection />
          </div>
          <div id="faq" className="w-full">
            <QuestionsSection />
          </div>
          <LandingFooter />
        </section>
      </main>
    </div>
  );
}
