import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briansvg } from "../Icon/Brainsvg";
import { logged, logout } from "../HelperFunction/authcheck";

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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-3xl border px-4 py-3 transition-all sm:px-5 ${
          isScrolled
            ? "border-stone-200/90 bg-white/92 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-white/60 bg-white/78 backdrop-blur-lg"
        }`}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-left"
        >
          <Briansvg />
          <div className="text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">
            <span className="text-stone-950">Conc</span>
            <span className="text-violet-500">ious</span>
          </div>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="relative flex items-center gap-6 text-sm font-medium tracking-tight text-stone-600">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                ref={(el) => {
                  linkRefs.current[id] = el;
                }}
                className={`transition ${
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
              className="absolute -bottom-2 left-0 h-0.5 rounded-full transition-[width,transform] duration-300 ease-out"
              style={{
                background:
                  "linear-gradient(90deg, rgba(141,128,188,1) 0%, rgba(216,208,244,1) 100%)",
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            {isLogin ? (
              <>
                <button
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:border-violet-300 hover:text-violet-600"
                  onClick={() => navigate("/Dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-600"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {isMenuOpen ? (
          <div className="w-full rounded-3xl border border-stone-200 bg-white/95 p-4 shadow-sm lg:hidden">
            <div className="flex flex-col gap-1">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
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

            <div className="mt-4 flex flex-col gap-3">
              {isLogin ? (
                <>
                  <button
                    className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/Dashboard");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
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
