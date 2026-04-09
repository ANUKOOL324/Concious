import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briansvg } from "../Icon/Brainsvg";
import { logged, logout } from "../HelperFunction/authcheck";

const sections = ["Home", "features", "testimonial", "pricing", "fAQs"];

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(logged());
  const [activeSection, setActiveSection] = useState<string>("Home");

  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  function handleLogout() {
    logout();
    setIsLogin(false);
    navigate("/");
  }

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
        threshold: 0.6,
      }
    );

    sections.forEach((id) => {
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

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 ">
      <nav className="w-full mx-auto py-9 h-14 flex items-center justify-between">
        <div className="flex items-center ml-5 gap-2 cursor-pointer">
          <Briansvg />
          <div className="flex text-3xl">
            <span className="text-black">Conc</span>
            <span style={{ color: "#8d80bc" }}>ious</span>
          </div>
        </div>
        <div className="relative flex items-center gap-8 tracking-tighter">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => {
                linkRefs.current[id] = el;
              }}
              className={`text-sm transition ${
                activeSection === id
                  ? "text-black"
                  : "text-gray-500 hover:opacity-70"
              }`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <div
            ref={indicatorRef}
            className="
    absolute
    -bottom-2
    left-0
    h-0.5
    transition-[width,transform]
    duration-300
    ease-out
  "
            style={{
              background:
                "linear-gradient(-90deg, rgb(136 112 223), rgb(212 212 237))",
            }}
          />
        </div>
        <div className="flex items-center mr-5 gap-4 cursor-pointer">
          {isLogin ? (
            <>
              <button
                className="px-6 py-2 text-sm text-white rounded-full cursor-pointer"
                style={{ backgroundColor: "#8d80bc" }}
                onClick={() => navigate("/Dashboard")}
              >
                Dashboard
              </button>

              <button
                className="px-6 py-2 text-sm text-white rounded-full bg-black cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 text-sm text-white rounded-full cursor-pointer"
              style={{ backgroundColor: "#8d80bc" }}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
