const cards = [
  {
    title: "Easy to use",
    description:
    "Even if you have no knowledge of trading, cryptocurrency, or stock market, the Aura Opus 4.7 model handles all your trades fully autonomously!",
    span: "md:col-span-2",
    height: "min-h-[260px]",
  },
  {
    title: "Trade with AI",
    description:
      "Use model-powered portfolio ideas and instantly convert them into actionable trade logic.",
    span: "md:col-span-1",
    height: "min-h-[260px]",
  },
  {
    title: "Let it run while you sleep",
    description:
      "While you sleep, Aura autonomously executes trades based on your configured strategy and provides real-time profit notifications via SMS and email.",
    span: "md:col-span-2",
    height: "min-h-[300px]",
  },
  {
    title: "Low Risk High Returns",
    description:
      "Aura monitors market risk and automatically adjusts or pauses trading to protect your capital.",
    span: "md:col-span-1",
    height: "min-h-[300px]",
  },
];

export function FeatureShowcaseSection() {
  return (
    <section
      className="mt-16 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 980px" }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-white md:text-4xl">
          Powerful Features
        </h2>
        <p className="mt-2 text-sm text-white/65 md:text-base">
          Everything you need to build, automate, and scale your portfolio workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className={`relative overflow-hidden rounded-3xl border border-white/15 bg-black/55 p-6 text-left backdrop-blur-sm ${card.span} ${card.height}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
            <div className="pointer-events-none absolute -left-20 top-6 h-52 w-52 rounded-full bg-cyan-400/14 blur-2xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-violet-400/14 blur-2xl" />

            <div className="relative z-10 mt-20">
              <h3 className="text-3xl font-semibold tracking-tight text-white">{card.title}</h3>
              <p className="mt-3 max-w-md text-lg text-white/75">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
