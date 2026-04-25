const caseStudies = [
  {
    company: "Atlas Capital",
    title: "From manual decisions to autonomous execution",
    summary:
      "Atlas moved from manual spot decisions to fully automated strategy runs with Aura AI Wallet.",
    result: "+128%",
    resultLabel: "Quarterly profit growth",
  },
  {
    company: "Northbridge Ventures",
    title: "Reduced risk exposure with AI-driven controls",
    summary:
      "Northbridge used Aura risk guards to reduce drawdown and keep portfolio volatility under control.",
    result: "-34%",
    resultLabel: "Lower max drawdown",
  },
  {
    company: "Helios Treasury",
    title: "24/7 rebalancing across multiple markets",
    summary:
      "Helios enabled continuous rebalancing and improved capital efficiency with automated execution.",
    result: "2.1x",
    resultLabel: "Faster rebalance cycles",
  },
];

export function CaseStudiesSection() {
  return (
    <section
      className="mt-16 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 760px" }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-white md:text-4xl">Case Studies</h2>
        <p className="mt-2 text-sm text-white/65 md:text-base">
          Real portfolio teams using Aura in production.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {caseStudies.map((item) => (
          <article
            key={item.company}
            className="rounded-3xl border border-white/15 bg-black/55 p-6 text-left backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-wide text-cyan-200/85">{item.company}</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-white/70">{item.summary}</p>

            <div className="mt-6 border-t border-white/12 pt-4">
              <p className="text-4xl font-semibold text-white">{item.result}</p>
              <p className="mt-1 text-sm text-white/65">{item.resultLabel}</p>
            </div>

            <button
              type="button"
              className="mt-5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Read case study
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
