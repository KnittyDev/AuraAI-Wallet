"use client";

import { MonthlyPerformanceChart } from "@/components/landing/monthly-performance-chart";
import { useLanguage } from "@/context/language-context";

export function RealResultsSection() {
  const { t } = useLanguage();

  const metrics = [
    { value: "$17,400", label: t("results.invest") },
    { value: "$3,350", label: t("results.auraEarn") },
    { value: "$1,520", label: t("results.manualEarn") },
  ];

  return (
    <section className="relative mt-16 w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/15 bg-black/55 p-6 text-white backdrop-blur-sm md:p-10">
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-6 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="md:pr-8">
          <h2 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
            {t("results.title")}
          </h2>

          <MonthlyPerformanceChart />

          <p className="mt-8 text-sm text-white/60">
            {t("results.disclaimer")}
          </p>
        </div>

        <div className="border-l border-white/12 pl-0 md:pl-10 md:pt-35">
          {metrics.map((metric, index) => (
            <div
              key={metric.value}
              className={`flex items-center justify-between gap-5 py-5 ${
                index < metrics.length - 1 ? "border-b border-white/12" : ""
              }`}
            >
              <span className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                {metric.value}
              </span>
              <span className="text-right text-xl text-white/80 md:text-2xl">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

