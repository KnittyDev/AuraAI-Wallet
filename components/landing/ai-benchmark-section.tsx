"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useLanguage } from "@/context/language-context";

const benchmarkData = [
  { model: "Llama 4", score: 64.3, accuracy: 79.5, latency: 610, sharpe: 0.94 },
  { model: "Grok-3", score: 71.6, accuracy: 84.1, latency: 520, sharpe: 1.21 },
  { model: "Gemini 3", score: 79.1, accuracy: 88.7, latency: 280, sharpe: 1.63 },
  { model: "GPT-4.1", score: 82.4, accuracy: 91.2, latency: 340, sharpe: 1.87 },
  { model: "AuraAI (Claude O4.7)", score: 97.8, accuracy: 99.8, latency: 12, sharpe: 3.42 },
];

const BAR_COLORS = [
  "rgba(255,255,255,0.08)",
  "rgba(255,255,255,0.12)",
  "rgba(255,255,255,0.18)",
  "rgba(255,255,255,0.25)",
  "#22d3ee",
];

export function AIBenchmarkSection() {
  const { language, t } = useLanguage();

  const metrics = [
    { value: "97.8", label: language === "en" ? "AuraAI (Claude Opus 4.7) score" : "AuraAI (Claude Opus 4.7) skoru", sub: t("benchmark.compositeIndex") },
    { value: "99.8%", label: t("benchmark.accuracy"), sub: t("benchmark.liveMarkets") },
    { value: "12ms", label: t("benchmark.latency"), sub: t("benchmark.edgeRuntime") },
    { value: "3.42", label: t("benchmark.sharpe"), sub: t("benchmark.riskReturns") },
  ];

  return (
    <section className="relative mt-16 w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/15 bg-black/55 p-6 text-white backdrop-blur-sm md:p-10">
      {/* Glow Effects — matching Real Results */}
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-6 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 md:grid-cols-2 md:gap-10">
        {/* Left: Title + Chart */}
        <div className="md:pr-8">
          <h2 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
            {t("benchmark.title")}
          </h2>

          {/* Chart Card */}
          <div className="mt-8 rounded-2xl border border-white/12 bg-black/35 p-4">
            {/* Mini stat boxes */}
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
                <p className="text-white/60">{t("benchmark.topModel")}</p>
                <p className="mt-1 text-xl font-semibold text-white">AuraAI (Claude Opus 4.7)</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
                <p className="text-white/60">{t("benchmark.scoreLead")}</p>
                <p className="mt-1 text-xl font-semibold text-cyan-400">+15.4 pts</p>
              </div>
            </div>

            {/* BarChart */}
            <div className="h-56 w-full md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(10, 12, 18, 0.95)",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                    formatter={(value: any) => [`${value}`, "Score"]}
                  />
                  <Bar
                    dataKey="score"
                    name={t("benchmark.financialScore")}
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                  >
                    {benchmarkData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-8 text-sm text-white/60">
            {t("benchmark.compositeDesc")}
          </p>
        </div>

        {/* Right: Key Metrics List */}
        <div className="border-l border-white/12 pl-0 md:pl-10 md:pt-35">
          {metrics.map((metric, index) => (
            <div
              key={metric.value}
              className={`flex items-center justify-between gap-5 py-5 ${index < metrics.length - 1 ? "border-b border-white/12" : ""
                }`}
            >
              <span className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                {metric.value}
              </span>
              <div className="text-right">
                <span className="text-xl text-white/80 md:text-2xl block">{metric.label}</span>
                <span className="text-xs text-white/30">{metric.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

