import Image from "next/image";
import chartImage from "@/app/chart.png";

const metrics = [
  { value: "2.4x", label: "Faster portfolio rebalancing" },
  { value: "1.9x", label: "Higher strategy performance*" },
  { value: "42%", label: "Lower manual trading workload" },
];

export function RealResultsSection() {
  return (
    <section className="mt-16 w-full max-w-6xl rounded-[28px] border border-white/15 bg-black/55 p-6 text-white backdrop-blur-sm md:p-10">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="md:pr-8">
          <h2 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Real Results
          </h2>

          <Image
            src={chartImage}
            alt="Aura performance chart"
            className="mt-8 h-auto w-56 object-contain drop-shadow-[0_20px_40px_rgba(113,81,255,0.4)]"
            priority
          />

          <p className="mt-8 text-sm text-white/60">
            *Sources: Binance, Kraken, Coinbase, Bitstamp benchmarks
          </p>
        </div>

        <div className="border-l border-white/12 pl-0 md:pl-10">
          {metrics.map((metric, index) => (
            <div
              key={metric.value}
              className={`flex items-center justify-between gap-5 py-5 ${
                index < metrics.length - 1 ? "border-b border-white/12" : ""
              }`}
            >
              <span className="text-6xl font-semibold tracking-tight text-white md:text-7xl">
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
