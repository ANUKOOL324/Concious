const pricingPlans = [
  {
    name: "Free",
    description: "For organizing links and building your first second-brain habit.",
    price: "Rs 0",
    cadence: "/ month",
    cta: "Get Started",
    featured: false,
    features: [
      { label: "Save YouTube, Twitter, and Spotify links", enabled: true },
      { label: "Manual folders and tags", enabled: true },
      { label: "Basic keyword search", enabled: true },
      { label: "Ashqnor AI chatbot", enabled: false },
      { label: "Semantic search", enabled: false },
      { label: "Smart recommendations", enabled: false },
    ],
  },
  {
    name: "Premium",
    description: "For people who want AI-assisted recall, search, and discovery.",
    price: "Rs 399",
    cadence: "/ month",
    cta: "Upgrade to Premium",
    featured: true,
    features: [
      { label: "Everything in Free", enabled: true },
      { label: "Ashqnor AI chatbot", enabled: true },
      { label: "Semantic search", enabled: true },
      { label: "AI-powered recommendations", enabled: true },
      { label: "Unlimited saved content", enabled: true },
      { label: "Faster indexing", enabled: true },
    ],
  },
  {
    name: "Custom",
    description: "Built for teams, communities, and organizations with special workflows.",
    price: "Custom",
    cadence: "",
    cta: "Contact Sales",
    featured: false,
    features: [
      { label: "Everything in Premium", enabled: true },
      { label: "Team and multi-user access", enabled: true },
      { label: "Custom AI workflows", enabled: true },
      { label: "Dedicated support", enabled: true },
      { label: "SLA and priority features", enabled: true },
      { label: "Usage-based pricing", enabled: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-stone-100/84 backdrop-blur-md">
          Pricing
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-[3.7rem]">
          Simple pricing for
          <span className="block text-violet-300">Concious</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-200/88 sm:text-base">
          Start free, build the habit, and upgrade when Ashqnor becomes essential
          to how you think and retrieve what matters.
        </p>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-4 lg:mt-10 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col overflow-hidden rounded-[1.85rem] border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_rgba(0,0,0,0.18)] lg:p-7 ${
              plan.featured
                ? "border-violet-300/35 bg-[linear-gradient(180deg,_rgba(139,92,246,0.22)_0%,_rgba(255,255,255,0.08)_100%)] shadow-[0_24px_56px_rgba(76,29,149,0.22)]"
                : "border-white/14 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
            }`}
          >
            {plan.featured ? (
              <div className="absolute right-5 top-5 rounded-full border border-violet-200/30 bg-violet-400/18 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-violet-100">
                Most Popular
              </div>
            ) : null}

            <div className="pr-20">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                {plan.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-200/78">
                {plan.description}
              </p>
            </div>

            <div className="mt-8">
              <div className="text-[2.6rem] font-semibold tracking-[-0.06em] text-white">
                {plan.price}
                {plan.cadence ? (
                  <span className="ml-2 text-base font-medium tracking-normal text-stone-300/78">
                    {plan.cadence}
                  </span>
                ) : null}
              </div>
            </div>

            <ul className="mt-8 space-y-3 text-sm leading-6 text-stone-100/84">
              {plan.features.map((feature) => (
                <li
                  key={feature.label}
                  className={`flex items-start gap-3 ${
                    feature.enabled ? "" : "text-stone-400/58"
                  }`}
                >
                  <span
                    className={`mt-2 h-1.5 w-1.5 rounded-full ${
                      feature.enabled ? "bg-violet-300/85" : "bg-stone-500/55"
                    }`}
                  />
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-8 w-full rounded-2xl py-3 text-sm font-semibold transition duration-200 ${
                plan.featured
                  ? "bg-violet-500 text-white hover:bg-violet-400"
                  : "border border-white/16 bg-white/10 text-white hover:bg-white/16"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
