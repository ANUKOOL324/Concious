import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RadialGroup } from "../components/icons/RadialGroup";
import { CenterBrand } from "../components/icons/LockIcon";
import { useNavigate } from "react-router-dom";
import { logged } from "../HelperFunction/authcheck";
import { Section2 } from "../sections/Section2";
import { Section3 } from "../sections/Section3";
import { Section4 } from "../sections/section4";
import { Section5 } from "../sections/section5";
import Navbar from "../components/layout/Navbar";

const MEMORY_CORE_ORIGIN = "400 300";

const TOGGLE_FILL_DURATION = 0.16;
const TOGGLE_STAGGER_AMOUNT = 0.18;
const TOGGLE_ROTATION_DURATION = 0.38;

function getSpinDuration() {
  if (window.matchMedia("(max-width: 639px)").matches) return 44;
  if (window.matchMedia("(max-width: 1023px)").matches) return 34;
  return 28;
}

function Main() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const radialGroupRef = useRef<SVGGElement | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleTweenRef = useRef<gsap.core.Timeline | null>(null);
  const islogin = logged();

  const startSpinTween = (radial: SVGGElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    spinTweenRef.current?.kill();
    gsap.set(radial, { svgOrigin: MEMORY_CORE_ORIGIN });

    spinTweenRef.current = gsap.to(radial, {
      rotation: "+=360",
      duration: getSpinDuration(),
      repeat: -1,
      ease: "linear",
      svgOrigin: MEMORY_CORE_ORIGIN,
    });
  };

  useEffect(() => {
    const radial = radialGroupRef.current;
    if (!radial) return;

    startSpinTween(radial);

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const tabletQuery = window.matchMedia("(max-width: 1023px)");

    const handleBreakpointChange = () => {
      if (!radialGroupRef.current || toggleTweenRef.current?.isActive()) {
        return;
      }
      startSpinTween(radialGroupRef.current);
    };

    mobileQuery.addEventListener("change", handleBreakpointChange);
    tabletQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mobileQuery.removeEventListener("change", handleBreakpointChange);
      tabletQuery.removeEventListener("change", handleBreakpointChange);
      spinTweenRef.current?.kill();
      spinTweenRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    const radial = radialGroupRef.current;
    if (!radial) {
      setIsAnimating(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsAnimating(false);
      return;
    }

    const targetColor = isOpen ? "#8d80bc" : "#070000";
    const paths = radial.querySelectorAll("path");

    spinTweenRef.current?.kill();
    spinTweenRef.current = null;

    toggleTweenRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        startSpinTween(radial);
      },
    });

    tl.to(
      paths,
      {
        fill: targetColor,
        duration: TOGGLE_FILL_DURATION,
        ease: "power2.out",
        stagger: {
          amount: TOGGLE_STAGGER_AMOUNT,
          from: "center",
          ease: "power1.out",
        },
      },
      0
    ).to(
      radial,
      {
        rotation: "+=36",
        svgOrigin: MEMORY_CORE_ORIGIN,
        ease: "back.out(1.7)",
        duration: TOGGLE_ROTATION_DURATION,
      },
      0
    );

    toggleTweenRef.current = tl;

    return () => {
      tl.kill();
      toggleTweenRef.current = null;
    };
  }, [isOpen, isAnimating]);

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

  const handleCorePointerUp = (
    event: React.PointerEvent<SVGUseElement>
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.preventDefault();
    handleToggle();
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950 select-none">
      <audio ref={audioRef} src="piano.mp3" preload="auto" />
      <Navbar />

      <section
        id="Home"
        className="relative overflow-x-hidden px-4 pt-[4.5rem] pb-8 sm:px-6 sm:pt-[4.75rem] sm:pb-10 md:px-8 md:pt-24 md:pb-10 lg:min-h-[calc(100vh-5rem)] lg:px-8 lg:pt-24 lg:pb-12"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(141,128,188,0.26),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#f5f5f4_52%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-56 w-56 rounded-full bg-violet-200/40 blur-3xl sm:h-72 sm:w-72 md:h-80 md:w-80" />

        <div className="mx-auto grid max-w-7xl items-center gap-6 sm:gap-8 md:gap-10 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-[1.06fr_0.84fr] lg:items-center lg:gap-8">
          <div className="max-w-2xl text-center md:mx-auto md:max-w-3xl lg:mx-0 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:pt-2 lg:text-left">
            <div className="inline-flex w-fit self-center rounded-full border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,241,255,0.92)_100%)] px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-stone-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-stone-200/70 backdrop-blur sm:px-4 sm:py-2 sm:text-[0.68rem] md:text-[0.72rem] md:tracking-[0.28em] lg:self-start">
              Welcome to Concious
            </div>

            <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.92] tracking-[-0.06em] text-stone-950 sm:mt-4 sm:text-[2.75rem] md:text-5xl md:leading-[0.9] lg:text-[4.9rem] lg:tracking-[-0.07em]">
              Your
              <span className="block text-violet-500">Second Brain</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-600 font-['Manrope',sans-serif] sm:hidden">
              Save what matters. Revisit with clarity.
            </p>

            <p className="mt-3 hidden max-w-xl text-sm leading-6 text-stone-600 font-['Manrope',sans-serif] sm:block md:mt-4 md:text-base md:leading-7 lg:mt-4 lg:max-w-2xl lg:text-[1.05rem] lg:leading-7">
              <span className="lg:hidden">
                Save what matters, revisit with clarity, and build a calmer knowledge system.
              </span>
              <span className="hidden lg:inline">
                Save the signals worth keeping, revisit them with clarity, and
                build a calmer personal knowledge system that grows with you.
              </span>
            </p>

            <p className="mt-3 hidden max-w-2xl text-xs font-medium uppercase tracking-[0.14em] text-stone-500 font-['IBM_Plex_Mono',monospace] md:mt-4 md:block md:text-sm lg:max-w-none lg:text-base lg:whitespace-nowrap">
              Virtue without capacity collapses{" "}
              <span className="text-violet-500">the moment it is tested.</span>
            </p>

            <div className="mt-4 flex flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 md:mt-6 lg:items-start lg:justify-start">
              <button
                onClick={() =>
                  islogin ? navigate("/dashboard") : navigate("/signup")
                }
                className="w-full rounded-full border border-stone-950/80 bg-stone-950/96 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition duration-200 font-['Manrope',sans-serif] hover:-translate-y-0.5 hover:bg-stone-900 hover:shadow-[0_20px_40px_rgba(15,23,42,0.2)] active:translate-y-px active:scale-[0.985] active:shadow-[0_8px_18px_rgba(15,23,42,0.14)] sm:w-auto sm:px-7 sm:py-3 sm:text-[0.98rem]"
              >
                {islogin ? "Open Dashboard" : "Get Started"}
              </button>
              <a
                href="#features"
                className="w-full rounded-full border border-white/80 bg-white/58 px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-md transition duration-200 font-['Manrope',sans-serif] hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white/78 hover:text-violet-600 hover:shadow-[0_18px_34px_rgba(15,23,42,0.1)] active:translate-y-px active:scale-[0.985] active:bg-white/68 active:shadow-[0_8px_18px_rgba(15,23,42,0.08)] sm:w-auto sm:px-7 sm:py-3 sm:text-[0.98rem]"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:mx-auto sm:max-w-lg sm:grid-cols-1 md:max-w-2xl md:grid-cols-3 md:gap-2.5 lg:mt-6 lg:max-w-none lg:gap-3">
              <div
                ref={(element) => {
                  heroCardRefs.current[0] = element;
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/75 bg-white/45 px-3.5 py-2.5 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/62 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] active:scale-[0.99] sm:px-4 sm:py-3 md:flex-col md:items-start md:gap-1.5 md:px-3 md:py-3 lg:block lg:rounded-[1.9rem] lg:p-4 lg:shadow-[0_14px_34px_rgba(15,23,42,0.07)] lg:hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 shrink-0 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone-400/90 font-['IBM_Plex_Mono',monospace] sm:text-[0.68rem] lg:text-[0.72rem] lg:tracking-[0.22em]">
                  Capture
                </p>
                <p className="relative z-10 min-w-0 text-[0.82rem] leading-5 text-stone-700/90 font-['Manrope',sans-serif] sm:text-sm md:mt-0 md:text-[0.8rem] md:leading-5 lg:mt-1.5 lg:text-[0.84rem] lg:leading-5">
                  <span className="md:hidden lg:hidden">Everything saved in one place.</span>
                  <span className="hidden md:inline lg:hidden">Save links and notes in one vault.</span>
                  <span className="hidden lg:inline">One vault for links, videos, and notes.</span>
                </p>
              </div>
              <div
                ref={(element) => {
                  heroCardRefs.current[1] = element;
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/75 bg-white/45 px-3.5 py-2.5 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/62 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] active:scale-[0.99] sm:px-4 sm:py-3 md:flex-col md:items-start md:gap-1.5 md:px-3 md:py-3 lg:block lg:rounded-[1.9rem] lg:p-4 lg:shadow-[0_14px_34px_rgba(15,23,42,0.07)] lg:hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 shrink-0 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone-400/90 font-['IBM_Plex_Mono',monospace] sm:text-[0.68rem] lg:text-[0.72rem] lg:tracking-[0.22em]">
                  Reflect
                </p>
                <p className="relative z-10 min-w-0 text-[0.82rem] leading-5 text-stone-700/90 font-['Manrope',sans-serif] sm:text-sm md:mt-0 md:text-[0.8rem] md:leading-5 lg:mt-1.5 lg:text-[0.84rem] lg:leading-5">
                  <span className="md:hidden lg:hidden">Revisit what matters.</span>
                  <span className="hidden md:inline lg:hidden">Return to what matters.</span>
                  <span className="hidden lg:inline">Return to what matters.</span>
                </p>
              </div>
              <div
                ref={(element) => {
                  heroCardRefs.current[2] = element;
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/75 bg-white/45 px-3.5 py-2.5 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/62 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] active:scale-[0.99] sm:px-4 sm:py-3 md:flex-col md:items-start md:gap-1.5 md:px-3 md:py-3 lg:block lg:rounded-[1.9rem] lg:p-4 lg:shadow-[0_14px_34px_rgba(15,23,42,0.07)] lg:hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <p className="relative z-10 shrink-0 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone-400/90 font-['IBM_Plex_Mono',monospace] sm:text-[0.68rem] lg:text-[0.72rem] lg:tracking-[0.22em]">
                  Share
                </p>
                <p className="relative z-10 min-w-0 text-[0.82rem] leading-5 text-stone-700/90 font-['Manrope',sans-serif] sm:text-sm md:mt-0 md:text-[0.8rem] md:leading-5 lg:mt-1.5 lg:text-[0.84rem] lg:leading-5">
                  <span className="md:hidden lg:hidden">Share your brain in one link.</span>
                  <span className="hidden md:inline lg:hidden">Publish thinking in one link.</span>
                  <span className="hidden lg:inline">Share your brain in one link.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[17.5rem] justify-center sm:max-w-[19rem] md:max-w-md lg:max-w-none lg:items-center lg:justify-end">
            <div className="absolute inset-x-6 top-6 -z-10 h-[58%] rounded-3xl bg-violet-300/25 blur-3xl sm:inset-x-8 sm:top-8 md:inset-x-14 md:top-10 md:h-[68%] md:rounded-[2.5rem]" />
            <div className="w-full rounded-3xl border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(245,240,255,0.82)_48%,rgba(255,255,255,0.76)_100%)] p-3 shadow-[0_20px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:rounded-4xl sm:p-4 md:max-w-lg md:p-5 lg:flex lg:h-[min(35rem,calc(100vh-12rem))] lg:max-h-[min(35rem,calc(100vh-12rem))] lg:max-w-[42rem] lg:min-h-0 lg:flex-col lg:p-4">
              <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white/70 px-2.5 py-1.5 sm:mb-3 sm:rounded-2xl sm:px-3 sm:py-2 md:px-4 md:py-3 lg:mb-1.5 lg:py-2">
                <div className="min-w-0">
                  <p className="truncate text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-stone-400 sm:text-[0.58rem] sm:tracking-[0.16em] md:text-xs lg:tracking-[0.2em]">
                    <span className="lg:hidden">Memory Core</span>
                    <span className="hidden lg:inline">Interactive Memory Core</span>
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold sm:px-2.5 sm:py-0.5 sm:text-[0.68rem] md:px-3 md:py-1 md:text-xs ${
                    isOpen
                      ? "bg-violet-100 text-violet-700"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {isOpen ? "Chill" : "Focused"}
                </span>
              </div>

              <div className="mx-auto w-full max-lg:aspect-square max-lg:max-h-44 max-lg:max-w-44 sm:max-lg:max-h-48 sm:max-lg:max-w-48 md:max-lg:max-h-56 md:max-lg:max-w-56 lg:flex lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center lg:py-0.5">
                <svg
                  viewBox="200 150 400 300"
                  className="mx-auto aspect-square w-full touch-manipulation max-lg:h-full max-lg:max-h-44 max-lg:max-w-44 sm:max-lg:max-h-48 sm:max-lg:max-w-48 md:max-lg:max-h-56 md:max-lg:max-w-56 lg:h-full lg:max-h-full lg:max-w-full lg:shrink"
                  preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                      <circle id="hitRing" cx="400" cy="300" r="130" />
                    </defs>
                    <RadialGroup ref={radialGroupRef} isOpen={isOpen} />
                    <CenterBrand />
                    <use
                      href="#hitRing"
                      fill="transparent"
                      role="button"
                      aria-label="Toggle memory core mode"
                      onPointerUp={handleCorePointerUp}
                      className={
                        isAnimating
                          ? "pointer-events-none"
                          : "cursor-pointer touch-manipulation"
                      }
                    />
                </svg>
              </div>

              <div className="mt-2 grid shrink-0 grid-cols-1 gap-2 sm:mt-3 lg:mt-2 lg:grid-cols-2 lg:gap-3">
                <div className="min-w-0 rounded-xl border border-violet-200/30 bg-[linear-gradient(135deg,rgba(31,22,37,0.98)_0%,rgba(63,43,84,0.96)_52%,rgba(116,82,168,0.92)_100%)] px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(76,29,149,0.2)] sm:rounded-2xl sm:px-3.5 sm:py-3 lg:min-h-0 lg:rounded-[1.6rem] lg:px-4 lg:py-2">
                  <p className="text-[0.52rem] uppercase tracking-[0.14em] text-violet-100/75 sm:text-[0.58rem] lg:text-[0.64rem] lg:tracking-[0.24em]">
                    Designed for
                  </p>
                  <p className="mt-0.5 text-[0.72rem] font-semibold leading-[1.35] text-stone-50 sm:text-xs lg:mt-1 lg:text-[0.9rem] lg:leading-5">
                    <span className="lg:hidden">Intentional habits</span>
                    <span className="hidden lg:inline">Intentional digital habits</span>
                  </p>
                </div>
                <div className="min-w-0 rounded-xl border border-violet-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(244,239,255,0.96)_100%)] px-3 py-2.5 shadow-[0_10px_20px_rgba(91,33,182,0.08)] sm:rounded-2xl sm:px-3.5 sm:py-3 lg:min-h-0 lg:rounded-[1.6rem] lg:px-4 lg:py-2">
                  <p className="text-[0.52rem] uppercase tracking-[0.14em] text-violet-400/70 sm:text-[0.58rem] lg:text-[0.64rem] lg:tracking-[0.24em]">
                    Built to help
                  </p>
                  <p className="mt-0.5 text-[0.72rem] font-semibold leading-[1.35] text-stone-800 sm:text-xs lg:mt-1 lg:text-[0.9rem] lg:leading-5">
                    <span className="lg:hidden">Less fragmented thinking</span>
                    <span className="hidden lg:inline">Less fragmented thinking</span>
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
        className="border-t border-stone-200 bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-8 lg:py-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex w-full flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
            <div className="w-full text-center lg:max-w-[15rem] lg:shrink-0 lg:text-left xl:max-w-[16rem]">
              <h4 className="text-sm font-bold tracking-[-0.04em] text-violet-500 sm:text-base">
                CONCIOUS
              </h4>
              <p className="mx-auto mt-1 max-w-xs text-[0.65rem] leading-[1.4] text-stone-600 sm:mt-1.5 sm:text-[0.7rem] md:text-xs md:leading-relaxed lg:mx-0 lg:max-w-none lg:text-[0.72rem] lg:leading-[1.45]">
                <span className="md:hidden">Store, revisit, and share what matters.</span>
                <span className="hidden md:inline">
                  Your digital consciousness, expanded into a calmer place to
                  store, revisit, and share what matters.
                </span>
              </p>
            </div>

            <div className="flex w-full items-start justify-between gap-1 sm:gap-2 md:grid md:grid-cols-3 md:gap-6 lg:ml-auto lg:w-auto lg:max-w-xl lg:flex-1 lg:justify-end lg:gap-10 xl:max-w-2xl xl:gap-14">
              <div className="min-w-0 flex-1 text-center md:text-left lg:flex-1 lg:max-w-[9rem]">
                <h5 className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-stone-900 sm:text-[0.58rem] md:text-xs lg:text-[0.7rem] lg:tracking-[0.18em]">
                  Product
                </h5>
                <ul className="mt-1 space-y-0.5 text-[0.62rem] leading-[1.3] text-stone-600 sm:mt-1.5 sm:space-y-1 sm:text-[0.68rem] md:mt-2 md:space-y-1.5 md:text-xs lg:text-[0.72rem] lg:leading-[1.4]">
                  <li>
                    <a href="#features" className="inline-block py-0.5 transition hover:text-violet-600">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="inline-block py-0.5 transition hover:text-violet-600">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faqs" className="inline-block py-0.5 transition hover:text-violet-600">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              <div className="min-w-0 flex-1 text-center md:text-left lg:flex-1 lg:max-w-[9rem]">
                <h5 className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-stone-900 sm:text-[0.58rem] md:text-xs lg:text-[0.7rem] lg:tracking-[0.18em]">
                  <span className="md:hidden">Explore</span>
                  <span className="hidden md:inline">Experience</span>
                </h5>
                <ul className="mt-1 space-y-0.5 text-[0.62rem] leading-[1.3] text-stone-600 sm:mt-1.5 sm:space-y-1 sm:text-[0.68rem] md:mt-2 md:space-y-1.5 md:text-xs lg:text-[0.72rem] lg:leading-[1.4]">
                  <li>
                    <a href="#testimonial" className="inline-block py-0.5 transition hover:text-violet-600">
                      <span className="md:hidden">Stories</span>
                      <span className="hidden md:inline">Testimonials</span>
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="inline-block py-0.5 transition hover:text-violet-600">
                      <span className="md:hidden">Vault</span>
                      <span className="hidden md:inline">Knowledge Vault</span>
                    </a>
                  </li>
                  <li>
                    <a href="#Home" className="inline-block py-0.5 transition hover:text-violet-600">
                      Hero
                    </a>
                  </li>
                </ul>
              </div>

              <div className="min-w-0 flex-1 text-center md:text-left lg:flex-1 lg:max-w-[9rem]">
                <h5 className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-stone-900 sm:text-[0.58rem] md:text-xs lg:text-[0.7rem] lg:tracking-[0.18em]">
                  <span className="md:hidden">Start</span>
                  <span className="hidden md:inline">Start Here</span>
                </h5>
                <ul className="mt-1 space-y-0.5 text-[0.62rem] leading-[1.3] text-stone-600 sm:mt-1.5 sm:space-y-1 sm:text-[0.68rem] md:mt-2 md:space-y-1.5 md:text-xs lg:text-[0.72rem] lg:leading-[1.4]">
                  <li>
                    <button
                      onClick={() => navigate("/signup")}
                      className="inline-block py-0.5 transition hover:text-violet-600"
                    >
                      Sign up
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/signin")}
                      className="inline-block py-0.5 transition hover:text-violet-600"
                    >
                      Sign in
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="inline-block py-0.5 transition hover:text-violet-600"
                    >
                      <span className="md:hidden">App</span>
                      <span className="hidden md:inline">Dashboard</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-stone-200 pt-3.5 text-center text-[0.62rem] text-stone-500 sm:mt-5 sm:pt-4 sm:text-[0.68rem] md:mt-8 md:pt-6 md:text-xs">
            © 2026 Concious. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;
