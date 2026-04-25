import { AuroraBackground } from "@/components/landing/aurora-background";
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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 md:px-10">
        <LandingHeader />
        <section className="mx-auto mt-16 flex w-full max-w-6xl flex-1 flex-col items-center text-center md:mt-20">
          <LandingHero />
          <PromptCard />
          <PricingSection />
          <FeatureShowcaseSection />
          <RealResultsSection />
          <CaseStudiesSection />
          <QuestionsSection />
          <LandingFooter />
        </section>
      </main>
    </div>
  );
}
