import { caseStudies } from "@/lib/case-studies-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";
import { LuArrowLeft, LuArrowUpRight } from "react-icons/lu";
import { LandingFooter } from "@/components/landing/landing-footer";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ id: cs.id }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = caseStudies.find((cs) => cs.id === id);

  if (!study) return notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/3 h-[600px] w-[600px] bg-cyan-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] bg-violet-500/5 blur-[160px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src={auraLogo} alt="Aura" className="h-8 w-8 rounded-full object-contain" />
            <span className="text-sm font-semibold text-white/80">Aura</span>
          </Link>
          <Link
            href="/#case-studies"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 transition hover:text-white hover:bg-white/10"
          >
            <LuArrowLeft className="h-3 w-3" />
            All Case Studies
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        {/* Hero */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              {study.tag}
            </span>
            <span className="text-[10px] text-white/20 tracking-widest uppercase">Case Study</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-white mb-8 max-w-[20ch]">
            {study.company}
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed text-white/50 max-w-2xl">
            {study.quote}
          </p>

          {/* Person */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-sm font-bold text-white/50">
              {study.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{study.person}</p>
              <p className="text-xs text-white/40">{study.role}</p>
            </div>
          </div>
        </div>

        {/* Key Results Bar */}
        <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {study.stats.map((stat) => (
            <div key={stat.label} className="bg-black/60 px-6 py-7 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold tracking-tight text-white mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

        {/* Content Sections */}
        <article className="space-y-16">
          {study.content.map((section, i) => (
            <section key={i}>
              <div className="flex items-center gap-4 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white">{section.heading}</h2>
              </div>
              <p className="text-base leading-[1.9] text-white/50 pl-12">
                {section.body}
              </p>
            </section>
          ))}
        </article>

        {/* Bottom CTA */}
        <div className="mt-24 rounded-[32px] border border-white/10 bg-white/[0.03] p-10 md:p-14 text-center backdrop-blur-xl">
          <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-3">Ready to start?</p>
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Get results like {study.company}</h3>
          <p className="text-base text-white/40 mb-8 max-w-lg mx-auto">
            Deploy Aura AI on your portfolio and let intelligent automation do the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-white/90"
            >
              Start for Free
              <LuArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <LandingFooter />
      </main>
    </div>
  );
}
