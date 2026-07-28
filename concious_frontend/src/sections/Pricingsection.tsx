import { motion } from "framer-motion";
import { useScrollReveal } from "../components/common/useScrollReveal";

const pricingPlans = [
  {
    name: "Free",
    description: "For organizing links and building your first second-brain habit.",
    mobileDescription: "Start organizing links and building your first brain habit.",
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
    mobileFeatures: [
      { label: "Save links from major platforms", enabled: true },
      { label: "Folders, tags, and keyword search", enabled: true },
      { label: "Ashqnor AI chatbot", enabled: false },
      { label: "Semantic search", enabled: false },
    ],
  },
  {
    name: "Premium",
    description: "For people who want AI-assisted recall, search, and discovery.",
    mobileDescription: "AI recall, semantic search, and smarter discovery.",
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
    mobileFeatures: [
      { label: "Everything in Free", enabled: true },
      { label: "Ashqnor + semantic search", enabled: true },
      { label: "AI recommendations", enabled: true },
      { label: "Unlimited saves", enabled: true },
    ],
  },
  {
    name: "Custom",
    description: "Built for teams, communities, and organizations with special workflows.",
    mobileDescription: "For teams and orgs with custom workflows.",
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
    mobileFeatures: [
      { label: "Everything in Premium", enabled: true },
      { label: "Team access and custom AI", enabled: true },
      { label: "Dedicated support", enabled: true },
      { label: "Usage-based pricing", enabled: true },
    ],
  },
];

export function PricingSection() {
  const reveal = useScrollReveal();

  return (
    <section
      id="pricing"
      className="relative z-10 flex min-h-0 flex-col justify-center px-4 py-8 text-white sm:px-6 sm:py-10 md:px-8 md:py-12 lg:min-h-[calc(100vh-3.5rem)] lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-stone-100/84 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.68rem] md:text-[0.72rem] md:tracking-[0.28em]">
          Pricing
        </p>
        <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:mt-4 sm:text-4xl md:mt-5 md:text-[2.6rem] lg:text-5xl lg:text-[3.7rem] lg:tracking-[-0.06em]">
          Simple pricing for
          <span className="block text-violet-300">Concious</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-stone-200/88 sm:text-sm sm:leading-6 md:mt-4 md:text-[0.95rem] md:leading-7 lg:text-base">
          <span className="md:hidden">
            Start free, then upgrade when Ashqnor becomes essential.
          </span>
          <span className="hidden md:inline lg:hidden">
            Start free and upgrade when Ashqnor becomes essential to how you retrieve ideas.
          </span>
          <span className="hidden lg:inline">
            Start free, build the habit, and upgrade when Ashqnor becomes essential
            to how you think and retrieve what matters.
          </span>
        </p>
      </div>

      <div className="mx-auto mt-5 grid w-full max-w-sm gap-3 sm:mt-7 sm:max-w-md sm:gap-3.5 md:mt-8 md:max-w-3xl md:grid-cols-2 md:gap-4 lg:mt-10 lg:max-w-6xl lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            {...reveal({ delay: index * 0.1, lift: 6 })}
            className={`relative flex flex-col overflow-hidden rounded-2xl border p-3.5 backdrop-blur-xl transition-colors duration-300 sm:p-4 md:rounded-[1.75rem] md:p-5 lg:rounded-[1.85rem] lg:p-7 ${
              plan.featured
                ? "border-violet-300/35 bg-[linear-gradient(180deg,_rgba(139,92,246,0.22)_0%,_rgba(255,255,255,0.08)_100%)] shadow-[0_24px_56px_rgba(76,29,149,0.22)]"
                : "border-white/14 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
            } ${plan.name === "Custom" ? "md:col-span-2 md:max-w-lg md:justify-self-center lg:col-span-1 lg:max-w-none" : ""}`}
          >
            {plan.featured ? (
              <div className="absolute right-3 top-3 rounded-full border border-violet-200/30 bg-violet-400/18 px-2.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-violet-100 sm:right-5 sm:top-5 sm:px-3 sm:py-1 sm:text-[0.68rem] sm:tracking-[0.22em]">
                Popular
              </div>
            ) : null}

            <div className="pr-14 sm:pr-16 md:pr-20">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl md:text-2xl md:tracking-[-0.04em]">
                {plan.name}
              </h3>
              <p className="mt-1.5 text-[0.72rem] leading-5 text-stone-200/78 sm:mt-2 sm:text-xs sm:leading-5 md:mt-3 md:text-sm md:leading-6">
                <span className="md:hidden">{plan.mobileDescription}</span>
                <span className="hidden md:inline">{plan.description}</span>
              </p>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
              <div className="text-[1.75rem] font-semibold tracking-[-0.05em] text-white sm:text-[2.1rem] md:text-[2.35rem] lg:text-[2.6rem] lg:tracking-[-0.06em]">
                {plan.price}
                {plan.cadence ? (
                  <span className="ml-1.5 text-xs font-medium tracking-normal text-stone-300/78 sm:ml-2 sm:text-sm md:text-base">
                    {plan.cadence}
                  </span>
                ) : null}
              </div>
            </div>

            <ul className="mt-4 space-y-1.5 text-[0.72rem] leading-5 text-stone-100/84 sm:mt-5 sm:space-y-2 sm:text-xs sm:leading-5 md:mt-6 md:space-y-2.5 md:text-sm md:leading-6 lg:mt-8 lg:space-y-3">
              {plan.mobileFeatures.map((feature) => (
                <li
                  key={`mobile-${feature.label}`}
                  className={`flex items-start gap-2 md:hidden ${
                    feature.enabled ? "" : "text-stone-400/58"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      feature.enabled ? "bg-violet-300/85" : "bg-stone-500/55"
                    }`}
                  />
                  <span>{feature.label}</span>
                </li>
              ))}
              {plan.features.map((feature) => (
                <li
                  key={feature.label}
                  className={`hidden items-start gap-2.5 md:flex lg:gap-3 ${
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

            <motion.button
              whileTap={{ scale: 0.97 }}
              className={`mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-colors duration-200 sm:mt-5 md:mt-6 md:rounded-2xl md:py-3 md:text-sm lg:mt-8 ${
                plan.featured
                  ? "bg-violet-500 text-white hover:bg-violet-400"
                  : "border border-white/16 bg-white/10 text-white hover:bg-white/16"
              }`}
            >
              {plan.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
