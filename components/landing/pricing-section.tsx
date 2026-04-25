type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description:
      "A limited but powerful automated portfolio experience for new users.",
    features: [
      "5 automated trades per day",
      "1 managed portfolio",
      "Basic weekly performance reports",
      "Basic buy/sell suggestions",
      "Automated flow using general strategies",
      "Trade management powered by Opus 4.6",
      "1 withdrawal every 3 days",
      "And more",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$15",
    description:
      "Full autonomous mode: AI opens and manages trades 24/7 while you track the results.",
    features: [
      "Unlimited automated trades",
      "Unlimited portfolio management",
      "Instant withdrawals",
      "Daily and weekly performance reports",
      "Auto sell / auto buy",
      "24/7 autonomous trade execution and management",
      "Fully autonomous portfolio operations",
      "And more",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Built exclusively for company investment operations with protected capital frameworks.",
    features: [
      "Company-only investment model",
      "Security deposit / guarantee collateral setup",
      "Partial loss recovery returned to the company",
      "Custom capital protection terms",
      "Enterprise-grade risk monitoring",
      "Dedicated investment support",
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section
      className="mt-14 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-white md:text-4xl">Pricing</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`mx-auto w-full max-w-[460px] rounded-3xl border p-6 text-left backdrop-blur-sm ${
              plan.highlighted
                ? "border-white/25 bg-black/60"
                : "border-white/15 bg-black/45"
            }`}
          >
            <div className="mb-4">
              <p className="text-sm text-white/70">{plan.name}</p>
              <p className="mt-1 text-4xl font-semibold text-white">{plan.price}</p>
              <p className="mt-2 text-sm text-white/70">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 text-sm text-white/85">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      plan.highlighted
                        ? "bg-violet-200/30 text-violet-100"
                        : "bg-white/10 text-white/90"
                    }`}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.2 8.3L6.4 11.1L12.6 4.9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`mt-6 w-full rounded-full px-4 py-2.5 text-sm font-medium transition ${
                plan.highlighted
                  ? "bg-white text-black hover:bg-white/85"
                  : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
