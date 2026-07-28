const consumeCards = [
  {
    eyebrow: "Capture Everything",
    accent: "from-violet-500/20 to-white/5",
    items: [
      "Save YouTube videos worth learning from",
      "Store Spotify podcasts and music",
      "Capture Twitter threads and ideas",
      "Save any link that matters to you",
    ],
    mobileItems: [
      "Save useful YouTube videos",
      "Store podcasts and music",
      "Capture Twitter threads",
      "Save links that matter",
    ],
  },
  {
    eyebrow: "Understand and Connect",
    accent: "from-sky-500/20 to-white/5",
    items: [
      "Semantic search by meaning, not just keywords",
      "Ashqnor AI understands your saved content",
      "Ask questions across all your links",
      "Discover hidden connections between ideas",
    ],
    mobileItems: [
      "Search by meaning, not keywords",
      "Ashqnor understands your saves",
      "Ask across all your links",
      "Find hidden idea connections",
    ],
  },
  {
    eyebrow: "Evolve Intentionally",
    accent: "from-fuchsia-500/20 to-white/5",
    items: [
      "AI recommendations shaped by your interests",
      "Podcast updates aligned with your thinking",
      "Focus and reset suggestions when needed",
      "Analyze your content diet over time",
    ],
    mobileItems: [
      "AI picks based on your interests",
      "Podcasts that match your thinking",
      "Focus and reset when needed",
      "Track your content diet",
    ],
  },
];

export function Consume() {
  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-10 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-violet-500/10 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-[12%] right-[10%] h-48 w-48 rounded-full bg-sky-400/10 blur-3xl sm:h-64 sm:w-64" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full border border-white/15 bg-white/6 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.28em] text-violet-200 backdrop-blur-xl sm:px-4 sm:py-2 sm:text-[0.72rem] sm:tracking-[0.34em]">
            What You Consume
          </div>

          <h2 className="text-balance mt-5 text-2xl font-semibold tracking-[-0.05em] text-white sm:mt-6 sm:text-5xl lg:text-6xl">
            Your digital inputs
            <span className="block bg-gradient-to-r from-violet-300 via-white to-violet-400 bg-clip-text text-transparent">
              shape who you become
            </span>
          </h2>

          <p className="mx-auto mt-4 whitespace-nowrap text-[0.68rem] leading-none text-slate-200 sm:mt-6 sm:text-[0.9rem] lg:text-[1rem]">
            Capture, understand, and evolve what you consume.
          </p>
        </div>

        <div className="mt-8 grid gap-3.5 sm:mt-10 sm:gap-5 lg:mt-14 lg:grid-cols-3">
          {consumeCards.map((card, index) => (
            <article
              key={card.eyebrow}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/7 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.18)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/35 hover:bg-white/10 hover:shadow-[0_34px_90px_rgba(2,6,23,0.26)] sm:rounded-[1.9rem] sm:p-8"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${card.accent} opacity-80 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative z-10">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-violet-200 sm:text-[0.72rem] sm:tracking-[0.34em]">
                  {card.eyebrow}
                </p>

                <ul className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-4">
                  {card.mobileItems.map((item, itemIndex) => (
                    <li
                      key={item}
                      className="text-pretty flex items-start gap-2.5 text-[0.8rem] leading-5 text-slate-100 sm:gap-3 sm:text-[1rem] sm:leading-7"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 shadow-[0_0_18px_rgba(167,139,250,0.55)] sm:mt-2 sm:h-2.5 sm:w-2.5" />
                      <span className="sm:hidden">{item}</span>
                      <span className="hidden sm:inline">{card.items[itemIndex]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-[1.6rem] border border-white/12 bg-gradient-to-br from-white/8 to-white/4 px-4 py-5 text-center shadow-[0_24px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl sm:mt-10 sm:max-w-3xl sm:rounded-[2rem] sm:px-10 sm:py-9 lg:mt-14 lg:px-12 lg:py-10">
          <p className="text-balance mx-auto max-w-2xl text-base font-medium leading-snug tracking-[-0.02em] text-white sm:text-xl sm:leading-[1.4] lg:text-[1.35rem] lg:leading-[1.45]">
            You do not just consume&nbsp;content.
            <span className="mt-1 block text-violet-300 sm:mt-1.5">
              You absorb values, habits, and&nbsp;beliefs.
            </span>
          </p>
          <p className="text-pretty mx-auto mt-3 max-w-xl text-[0.8rem] leading-5 text-slate-300 sm:mt-4 sm:text-[0.95rem] sm:leading-7 lg:text-base">
            Concious makes that process visible, intentional, and&nbsp;intelligent.
          </p>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center sm:mt-10 sm:pt-8 lg:mt-14">
          <p className="text-balance mx-auto max-w-xl text-base font-light italic leading-snug tracking-[-0.03em] text-slate-200 sm:text-2xl sm:leading-relaxed">
            A calm and clear mind will soon become a necessity, not a luxury.
          </p>
          <p className="text-balance mt-3 text-lg font-semibold tracking-[-0.04em] text-violet-300 sm:mt-5 sm:text-3xl">
            Concious exists for that future.
          </p>
        </div>
      </div>
    </section>
  );
}
