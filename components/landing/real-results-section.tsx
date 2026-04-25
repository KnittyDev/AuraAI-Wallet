import { MonthlyPerformanceChart } from "@/components/landing/monthly-performance-chart";

const metrics = [
  { value: "$17,400", label: "You invest in 1 month" },
  { value: "$3,350", label: "You earn with Aura AI Wallet*" },
  { value: "$1,520", label: "You earn with manual trading" },
];

export function RealResultsSection() {
  return (
    <section className="mt-16 w-full max-w-6xl rounded-[28px] border border-white/15 bg-black/55 p-6 text-white backdrop-blur-sm md:p-10">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="md:pr-8">
          <h2 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Real Results
          </h2>

          <MonthlyPerformanceChart />

          <p className="mt-8 text-sm text-white/60">
            *Illustrative 30-day estimate based on historical strategy benchmarks. (Opus 4.7 model)
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
