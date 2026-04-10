import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Nbutton } from "../components/Nbutton";

const featureCards = [
  {
    eyebrow: "Capture",
    icon: "↗",
    title: "Unified Content Vault",
    points: [
      "Save YouTube, Twitter, Spotify, articles, and podcasts",
      "Bring scattered bookmarks into one intentional system",
      "Keep content for reflection instead of endless scrolling",
      "A calmer upgrade from watch later and old bookmark piles",
    ],
  },
  {
    eyebrow: "Search",
    icon: "◌",
    title: "AI Mode",
    points: [
      "Search semantically across the things you already saved",
      "Ask questions grounded in your own collected content",
      "Chat with your knowledge through Ashqnor",
      "Spot patterns and connections across ideas more quickly",
    ],
  },
  {
    eyebrow: "Balance",
    icon: "✦",
    title: "Intentional Mode",
    points: [
      "Track how and what you consume online",
      "Balance short-form and long-form content intake",
      "Measure quality of attention instead of raw screen time",
      "Generate clarity and brain-health style reports",
    ],
  },
];

export function Section2() {
  const navigate = useNavigate();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = cardRefs.current.filter(
      (card): card is HTMLDivElement => card !== null
    );

    if (!cards.length) return;

    const animation = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 24,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: undefined,
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section id="features" className="bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-stone-200 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div
          className="absolute inset-0 bg-center bg-cover lg:bg-fixed"
          style={{ backgroundImage: "url('/jakk.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(12,10,18,0.48)_0%,_rgba(12,10,18,0.58)_100%)]" />

        <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-stone-100/85 backdrop-blur-md">
              Built for clarity
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-[3.7rem]">
              Features that make remembering feel light
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-200/90 sm:text-base">
              A second-brain flow designed to capture signal, retrieve it fast,
              and build healthier patterns around what you consume.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3">
            {featureCards.map((card, index) => (
              <div
                key={card.title}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/16 bg-white/10 p-5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:bg-white/14 hover:shadow-[0_28px_54px_rgba(0,0,0,0.18)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.24em] text-stone-200/75">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {card.title}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/18 bg-white/12 text-xl text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                    {card.icon}
                  </div>
                </div>

                <ul className="relative z-10 mt-5 space-y-3 text-sm leading-6 text-stone-100/82">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-300/80" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center lg:mt-10">
            <Nbutton
              onClose={() => navigate("/Why")}
              text="Why Concious?"
              css="rounded-full border border-white/24 bg-white/10 px-8 py-3 text-base font-semibold text-white shadow-[0_14px_32px_rgba(0,0,0,0.14)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/16 hover:border-white/36 active:translate-y-[1px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
