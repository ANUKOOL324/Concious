import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briansvg } from "../../Icon/Brainsvg";
import { logged, logout } from "../../HelperFunction/authcheck";

const sections = [
  { id: "Home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "testimonial", label: "Stories" },
  { id: "pricing", label: "Pricing" },
  { id: "faqs", label: "FAQs" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(logged());
  const [activeSection, setActiveSection] = useState<string>("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  function handleLogout() {
    logout();
    setIsLogin(false);
    setIsMenuOpen(false);
    navigate("/");
  }

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeLink = linkRefs.current[activeSection];
    const indicator = indicatorRef.current;

    if (activeLink && indicator) {
      indicator.style.width = `${activeLink.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    }
  }, [activeSection]);

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-4 sm:pt-2.5 md:pt-3">
      <nav
        className={`mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 rounded-2xl border px-3 py-2 transition-all sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-2.5 md:px-5 md:py-2.5 lg:min-h-16 lg:gap-4 lg:px-5 lg:py-3 ${
          isScrolled
            ? "border-stone-200/90 bg-white/92 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-white/60 bg-white/78 backdrop-blur-lg"
        }`}
      >
        <button
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-1.5 text-left sm:gap-2"
        >
          <span className="inline-flex shrink-0 [&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8 lg:[&_svg]:h-9 lg:[&_svg]:w-9">
            <Briansvg />
          </span>
          <div className="text-lg font-semibold leading-none tracking-[-0.06em] sm:text-xl md:text-[1.35rem] lg:text-[1.75rem]">
            <span className="text-stone-950">Conc</span>
            <span className="text-violet-500">ious</span>
          </div>
        </button>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          <div className="relative flex items-center gap-4 text-[0.8rem] font-medium tracking-tight text-stone-600 xl:gap-5 xl:text-sm">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                ref={(el) => {
                  linkRefs.current[id] = el;
                }}
                className={`whitespace-nowrap transition ${
                  activeSection === id
                    ? "text-stone-950"
                    : "hover:text-violet-600"
                }`}
              >
                {label}
              </a>
            ))}
            <div
              ref={indicatorRef}
              className="absolute -bottom-1.5 left-0 h-0.5 rounded-full transition-[width,transform] duration-300 ease-out"
              style={{
                background:
                  "linear-gradient(90deg, rgba(141,128,188,1) 0%, rgba(216,208,244,1) 100%)",
              }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:gap-3">
            {isLogin ? (
              <>
                <button
                  className="rounded-full border border-stone-300 px-3.5 py-1.5 text-[0.8rem] font-semibold text-stone-900 transition hover:border-violet-300 hover:text-violet-600 xl:px-5 xl:py-2 xl:text-sm"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="rounded-full bg-stone-950 px-3.5 py-1.5 text-[0.8rem] font-semibold text-white transition hover:bg-stone-800 xl:px-5 xl:py-2 xl:text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="rounded-full bg-violet-500 px-3.5 py-1.5 text-[0.8rem] font-semibold text-white transition hover:bg-violet-600 xl:px-5 xl:py-2 xl:text-sm"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 sm:h-10 sm:w-10 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="space-y-1.5">
            <span
              className={`block h-0.5 w-4 bg-current transition sm:w-[1.15rem] ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition sm:w-[1.15rem] ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition sm:w-[1.15rem] ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {isMenuOpen ? (
          <div className="w-full rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-sm sm:rounded-3xl sm:p-4 lg:hidden">
            <div className="flex flex-col gap-0.5">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`rounded-xl px-3 py-2.5 text-[0.82rem] font-medium transition sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm ${
                    activeSection === id
                      ? "bg-violet-50 text-violet-700"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:gap-2.5">
              {isLogin ? (
                <>
                  <button
                    className="rounded-full border border-stone-300 px-4 py-2.5 text-[0.82rem] font-semibold text-stone-900 sm:py-3 sm:text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="rounded-full bg-stone-950 px-4 py-2.5 text-[0.82rem] font-semibold text-white sm:py-3 sm:text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="rounded-full bg-violet-500 px-4 py-2.5 text-[0.82rem] font-semibold text-white sm:py-3 sm:text-sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
};

export default Navbar;
