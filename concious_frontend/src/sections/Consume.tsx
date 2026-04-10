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
    footer: "No folders. No chaos. Just meaningful capture.",
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
    footer: "Your content becomes a knowledge graph, not a list.",
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
    footer: "What you repeat in attention becomes your mindset.",
  },
];

export function Consume() {
  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-violet-500/10 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-[12%] right-[10%] h-48 w-48 rounded-full bg-sky-400/10 blur-3xl sm:h-64 sm:w-64" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[0.72rem] uppercase tracking-[0.34em] text-violet-200 backdrop-blur-xl">
            What You Consume
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Your digital inputs
            <span className="block bg-gradient-to-r from-violet-300 via-white to-violet-400 bg-clip-text text-transparent">
              shape who you become
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            Concious helps you capture, understand, and evolve your digital
            consumption, not just store it. The goal is not more saved content.
            It is clearer thinking.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3">
          {consumeCards.map((card, index) => (
            <article
              key={card.eyebrow}
              className="group relative overflow-hidden rounded-[1.9rem] border border-white/12 bg-white/7 p-7 shadow-[0_24px_70px_rgba(2,6,23,0.18)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/35 hover:bg-white/10 hover:shadow-[0_34px_90px_rgba(2,6,23,0.26)] sm:p-8"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${card.accent} opacity-80 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative z-10">
                <p className="text-[0.72rem] uppercase tracking-[0.34em] text-violet-200">
                  {card.eyebrow}
                </p>

                <ul className="mt-6 space-y-4">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[1rem] leading-7 text-slate-100"
                    >
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 shadow-[0_0_18px_rgba(167,139,250,0.55)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-7 text-slate-300">
                  {card.footer}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/12 bg-gradient-to-br from-white/8 to-white/4 px-6 py-8 text-center shadow-[0_24px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl sm:px-10 sm:py-10 lg:mt-14">
          <p className="text-2xl font-medium leading-[1.35] tracking-[-0.03em] text-white sm:text-3xl">
            You do not just consume content.
            <span className="block text-violet-300">
              You absorb values, habits, and beliefs.
            </span>
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Concious makes that process visible, intentional, and intelligent.
          </p>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center lg:mt-14">
          <p className="text-xl font-light italic tracking-[-0.03em] text-slate-200 sm:text-2xl">
            A calm and clear mind will soon become a necessity, not a luxury.
          </p>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-violet-300 sm:text-3xl">
            Concious exists for that future.
          </p>
        </div>
      </div>
    </section>
  );
}
