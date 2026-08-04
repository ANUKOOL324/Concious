import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Nbutton } from "../components/common/Nbutton";
import { useScrollReveal } from "../components/common/useScrollReveal";

const featureCards = [
  {
    eyebrow: "Capture",
    icon: "↗",
    title: "Unified Content Vault",
    mobileTitle: "Content Vault",
    points: [
      "Save YouTube, Twitter/X, Spotify, articles, PDFs, and more",
      "Add notes, tags, collections, and why you saved each item",
      "Bring scattered bookmarks into one intentional system",
      "Keep content for reflection instead of endless scrolling",
    ],
    mobilePoints: [
      "Save links, PDFs, videos, and notes in one place",
      "Replace messy bookmarks with one calm vault",
    ],
  },
  {
    eyebrow: "Search",
    icon: "◌",
    title: "AI Mode",
    mobileTitle: "AI Search",
    points: [
      "Search semantically across everything you have indexed",
      "Ask questions grounded in your own collected content",
      "Chat with your knowledge through Ashqnor",
      "Get source-backed answers instead of generic chat",
    ],
    mobilePoints: [
      "Search by meaning across saved content",
      "Ask Ashqnor questions grounded in your brain",
    ],
  },
  {
    eyebrow: "Balance",
    icon: "✦",
    title: "Intentional Mode",
    mobileTitle: "Intentional Mode",
    points: [
      "Track how and what you consume online",
      "Balance short-form and long-form content intake",
      "Measure quality of attention instead of raw screen time",
      "Generate clarity and brain-health style reports",
    ],
    mobilePoints: [
      "Track what you consume with more intention",
      "Balance attention instead of raw screen time",
    ],
  },
];

export function Section2() {
  const navigate = useNavigate();
  const reveal = useScrollReveal();

  return (
    <section id="features" className="bg-white px-3 py-3 sm:px-5 sm:py-4 md:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-stone-200 shadow-[0_16px_40px_rgba(15,23,42,0.1)] md:rounded-[1.85rem] lg:rounded-[2rem] sm:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div
          className="absolute inset-0 bg-center bg-cover lg:bg-fixed"
          style={{ backgroundImage: "url('/jakk.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(12,10,18,0.48)_0%,_rgba(12,10,18,0.58)_100%)]" />

        <div className="relative z-10 flex min-h-0 flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 md:px-8 md:py-12 lg:min-h-[calc(100vh-3.5rem)] lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-white/20 bg-white/8 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-stone-100/85 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.68rem] md:text-[0.72rem] md:tracking-[0.28em]">
              Built for clarity
            </p>
            <h2 className="mt-3 text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:mt-4 sm:text-[2.15rem] md:mt-5 md:text-[2.45rem] lg:text-[2.95rem] lg:tracking-[-0.06em]">
              <span className="sm:hidden">Features that feel light</span>
              <span className="hidden sm:inline lg:hidden">Features built for clarity</span>
              <span className="hidden lg:inline">Features that make remembering feel light</span>
            </h2>
            <p className="mx-auto mt-3 whitespace-nowrap text-[0.68rem] leading-none text-stone-200/90 sm:text-[0.85rem] md:mt-4 md:text-[0.9rem] lg:text-[0.95rem]">
              Capture signal, find it fast, build healthier habits.
            </p>
          </div>

          <div className="mx-auto mt-5 grid w-full max-w-[16.5rem] grid-cols-1 gap-2.5 sm:mt-7 sm:max-w-[18rem] sm:gap-3 md:mt-8 md:max-w-2xl md:grid-cols-2 md:gap-3.5 lg:mt-10 lg:max-w-5xl lg:grid-cols-3 lg:gap-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                {...reveal({ delay: index * 0.1, lift: 6 })}
                className={`group relative mx-auto w-full min-w-0 cursor-default overflow-hidden rounded-2xl border border-white/16 bg-white/10 p-3 text-white shadow-[0_14px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/14 sm:p-3.5 md:mx-0 md:rounded-[1.55rem] md:p-4 lg:rounded-[1.75rem] lg:p-5 ${
                  index === 2
                    ? "md:col-span-2 md:max-w-[18rem] md:justify-self-center lg:col-span-1 lg:max-w-none"
                    : ""
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-2.5 md:gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.52rem] uppercase tracking-[0.16em] text-stone-200/75 sm:text-[0.58rem] md:text-[0.64rem] lg:text-[0.72rem] lg:tracking-[0.24em]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold tracking-[-0.03em] text-white sm:mt-1.5 sm:text-base md:mt-2 md:text-lg lg:mt-3 lg:text-2xl lg:tracking-[-0.04em]">
                      <span className="md:hidden">{card.mobileTitle}</span>
                      <span className="hidden md:inline">{card.title}</span>
                    </h3>
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/18 bg-white/12 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:h-8 sm:w-8 sm:rounded-xl sm:text-base md:h-9 md:w-9 md:text-lg lg:h-11 lg:w-11 lg:rounded-2xl lg:text-xl">
                    {card.icon}
                  </div>
                </div>

                <ul className="relative z-10 mt-2 space-y-1.5 text-[0.68rem] leading-[1.4] text-stone-100/82 sm:mt-2.5 sm:space-y-1.5 sm:text-[0.72rem] md:mt-3 md:space-y-2 md:text-xs md:leading-5 lg:mt-5 lg:space-y-3 lg:text-sm lg:leading-6">
                  {card.mobilePoints.map((point) => (
                    <li key={`mobile-${point}`} className="flex items-start gap-2 md:hidden">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300/80" />
                      <span>{point}</span>
                    </li>
                  ))}
                  {card.points.map((point) => (
                    <li key={point} className="hidden items-start gap-2.5 md:flex lg:gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300/80" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...reveal({ delay: 0.15 })}
            className="mt-5 flex justify-center sm:mt-8 lg:mt-10"
          >
            <Nbutton
              onClose={() => navigate("/why")}
              withSound
              text="Why Concious?"
              css="cursor-pointer rounded-full border border-white/24 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(0,0,0,0.14)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/16 hover:border-white/36 active:translate-y-[1px] sm:px-8 sm:py-3 sm:text-base"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
