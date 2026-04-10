import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RadialGroup } from "../components/RadialGroup";
import { CenterBrand } from "../components/LockIcon";
import { useNavigate } from "react-router-dom";
import { logged } from "../HelperFunction/authcheck";
import { Section2 } from "../sections/Section2";
import { Section3 } from "../sections/Section3";
import { Section4 } from "../sections/section4";
import { Section5 } from "../sections/section5";
import Navbar from "../components/Navbar";

function Main() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const islogin = logged();

  useEffect(() => {
    if (!isAnimating) return;

    const targetColor = isOpen ? "#8d80bc" : "#070000";
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(".radialGroup path", {
      fill: targetColor,
      duration: 0.4,
      stagger: 0.08,
    }).to(
      ".radialGroup",
      {
        rotation: "+=36",
        svgOrigin: "400 300",
        ease: "elastic.out(0.9, 0.7)",
        duration: 1,
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [isOpen, isAnimating]);

  useEffect(() => {
    const spin = gsap.to(".radialGroup", {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: "linear",
      svgOrigin: "400 300",
    });

    return () => {
      spin.kill();
    };
  }, []);

  useEffect(() => {
    audioRef.current?.play().catch(() => {
      // Autoplay may be blocked by the browser. Ignore silently.
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = heroCardRefs.current.filter(
      (card): card is HTMLDivElement => card !== null
    );

    if (!cards.length) return;

    const animation = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 18,
        scale: 0.985,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950 select-none">
      <audio ref={audioRef} src="piano.mp3" preload="auto" />
      <Navbar />

      <section
        id="Home"
        className="relative overflow-hidden px-4 pt-24 pb-6 sm:px-6 sm:pt-28 lg:px-8 lg:h-[calc(100vh-1rem)] lg:min-h-0 lg:pt-24 lg:pb-4"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(141,128,188,0.26),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#f5f5f4_52%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-64 w-64 rounded-full bg-violet-200/40 blur-3xl sm:h-80 sm:w-80" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:h-full lg:grid-cols-[1.06fr_0.84fr] lg:gap-8">
          <div className="max-w-2xl text-center lg:flex lg:h-full lg:max-w-none lg:flex-col lg:justify-center lg:text-left">
            <div className="inline-flex w-fit self-center rounded-full border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,241,255,0.92)_100%)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-stone-200/70 backdrop-blur sm:px-5 sm:text-[0.72rem] lg:self-start">
              Welcome to Concious
            </div>

            <h1 className="mt-4 text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-stone-950 sm:text-6xl lg:text-[4.9rem]">
              Your
              <span className="block text-violet-500">Second Brain</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 font-['Manrope',sans-serif] sm:text-lg sm:leading-8 lg:max-w-2xl lg:text-[1.05rem] lg:leading-7">
              Save the signals worth keeping, revisit them with clarity, and
              build a calmer personal knowledge system that grows with you.
            </p>

            <p className="mt-3 max-w-2xl text-sm font-medium uppercase tracking-[0.14em] text-stone-500 font-['IBM_Plex_Mono',monospace] sm:text-base lg:max-w-none lg:whitespace-nowrap">
              Virtue without capacity collapses{" "}
              <span className="text-violet-500">the moment it is tested.</span>
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:items-start">
              <button
                onClick={() =>
                  islogin ? navigate("/Dashboard") : navigate("/signup")
                }
                className="w-full rounded-full border border-stone-950/80 bg-stone-950/96 px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition duration-200 font-['Manrope',sans-serif] hover:-translate-y-0.5 hover:bg-stone-900 hover:shadow-[0_20px_40px_rgba(15,23,42,0.2)] active:translate-y-px active:scale-[0.985] active:shadow-[0_8px_18px_rgba(15,23,42,0.14)] sm:w-auto sm:px-7"
              >
                {islogin ? "Open Dashboard" : "Get Started"}
              </button>
              <a
                href="#features"
                className="w-full rounded-full border border-white/80 bg-white/58 px-6 py-3 text-[0.98rem] font-semibold text-stone-800 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-md transition duration-200 font-['Manrope',sans-serif] hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white/78 hover:text-violet-600 hover:shadow-[0_18px_34px_rgba(15,23,42,0.1)] active:translate-y-px active:scale-[0.985] active:bg-white/68 active:shadow-[0_8px_18px_rgba(15,23,42,0.08)] sm:w-auto sm:px-7"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div
                ref={(element) => {
                  heroCardRefs.current[0] = element;
                }}
                className="group relative overflow-hidden rounded-[1.9rem] border border-white/75 bg-white/45 p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/62 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] active:scale-[0.99] lg:p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-stone-400/90 font-['IBM_Plex_Mono',monospace]">
                  Capture
                </p>
                <p className="relative z-10 mt-2 text-[0.98rem] leading-7 text-stone-700/90 font-['Manrope',sans-serif]">
                  Keep links, videos, podcasts, and notes in one place.
                </p>
              </div>
              <div
                ref={(element) => {
                  heroCardRefs.current[1] = element;
                }}
                className="group relative overflow-hidden rounded-[1.9rem] border border-white/75 bg-white/45 p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/62 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] active:scale-[0.99] lg:p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-stone-400/90 font-['IBM_Plex_Mono',monospace]">
                  Reflect
                </p>
                <p className="relative z-10 mt-2 text-[0.98rem] leading-7 text-stone-700/90 font-['Manrope',sans-serif]">
                  Return to what matters instead of losing it in the feed.
                </p>
              </div>
              <div
                ref={(element) => {
                  heroCardRefs.current[2] = element;
                }}
                className="group relative overflow-hidden rounded-[1.9rem] border border-white/75 bg-white/45 p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/62 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] active:scale-[0.99] lg:p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-stone-400/90 font-['IBM_Plex_Mono',monospace]">
                  Share
                </p>
                <p className="relative z-10 mt-2 text-[0.98rem] leading-7 text-stone-700/90 font-['Manrope',sans-serif]">
                  Publish your best thinking with a simple brain link.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-2xl justify-center lg:h-full lg:max-w-none lg:items-center lg:justify-end">
            <div className="absolute inset-x-14 top-10 -z-10 h-[72%] rounded-[2.5rem] bg-violet-300/25 blur-3xl" />
            <div className="w-full rounded-4xl border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(245,240,255,0.82)_48%,rgba(255,255,255,0.76)_100%)] p-4 shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6 lg:max-w-[42rem] lg:flex lg:h-[35rem] lg:flex-col lg:p-4">
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 lg:mb-1.5 lg:py-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Interactive Memory Core
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isOpen
                      ? "bg-violet-100 text-violet-700"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {isOpen ? "Chill" : "Focused"}
                </span>
              </div>

              <div className="aspect-square w-full lg:mx-auto lg:h-98 lg:w-98 lg:max-h-none lg:max-w-none lg:flex-none">
                <svg
                  viewBox="200 150 400 300"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <circle id="hitRing" cx="400" cy="300" r="130" />
                  </defs>
                  <RadialGroup isOpen={isOpen} />
                  <CenterBrand />
                  <use
                    href="#hitRing"
                    fill="transparent"
                    onClick={handleToggle}
                    className={
                      isAnimating ? "pointer-events-none" : "cursor-pointer"
                    }
                  />
                </svg>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-4">
                <div className="rounded-[1.6rem] border border-violet-200/30 bg-[linear-gradient(135deg,rgba(31,22,37,0.98)_0%,rgba(63,43,84,0.96)_52%,rgba(116,82,168,0.92)_100%)] px-4 py-3 text-white shadow-[0_18px_35px_rgba(76,29,149,0.22)] lg:min-h-[4.1rem] lg:px-4 lg:py-2">
                  <p className="text-[0.64rem] uppercase tracking-[0.24em] text-violet-100/75">
                    Designed for
                  </p>
                  <p className="mt-1 text-[0.98rem] font-semibold leading-5 text-stone-50">
                    intentional digital habits
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-violet-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(244,239,255,0.96)_100%)] px-4 py-3 shadow-[0_12px_24px_rgba(91,33,182,0.08)] lg:min-h-[4.1rem] lg:px-4 lg:py-2">
                  <p className="text-[0.64rem] uppercase tracking-[0.24em] text-violet-400/70">
                    Built to help
                  </p>
                  <p className="mt-1 text-[0.98rem] font-semibold leading-5 text-stone-800">
                    thinking feel less fragmented
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />

      <footer
        id="contact"
        className="border-t border-stone-200 bg-white px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            <div className="max-w-sm">
              <h4 className="text-lg font-bold text-violet-500">CONCIOUS</h4>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Your digital consciousness, expanded into a calmer place to
                store, revisit, and share what matters.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                Product
              </h5>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                <li>
                  <a href="#features" className="transition hover:text-violet-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition hover:text-violet-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="transition hover:text-violet-600">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                Experience
              </h5>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                <li>
                  <a href="#testimonial" className="transition hover:text-violet-600">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition hover:text-violet-600">
                    Knowledge Vault
                  </a>
                </li>
                <li>
                  <a href="#Home" className="transition hover:text-violet-600">
                    Hero
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                Start Here
              </h5>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="transition hover:text-violet-600"
                  >
                    Create account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signin")}
                    className="transition hover:text-violet-600"
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="transition hover:text-violet-600"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
            © 2026 Concious. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;
