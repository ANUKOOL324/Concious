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

function Main(){
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAnimating) return;

    const targetColor = isOpen ? "#8d80bc" : "#070000";

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(".radialGroup path", {
      stroke: targetColor,
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
      repeat: -3,
      ease: "linear",
      svgOrigin: "400 300",
    });

    return () => {
      spin.kill();
    };
  }, []);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
  };

  const islogin = logged();

  //   const [islogin ,setislogin] = useState(logged());

  // function handleLogout()
  // {
  //     logout();
  //     setislogin(false);
  // }

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playIntro() {
    audioRef.current?.play();
  }

  useEffect(() => {
    //const sing =setInterval(()=>{playIntro()},18000)
    playIntro();
    // return () => {
    // clearInterval(sing);}
  }, []);

  return (
    <div className="w-full h-screen bg-gray-200 select-none ">
      <audio ref={audioRef} src="piano.mp3" preload="auto" />
      <Navbar />
      <section
        id="Home"
        className="min-h-screen flex select-none flex-col items-center py-3 px-6 mt-10"
      >
        <div className="text-center h-10 mt-5">
          <h1
            className="text-2xl hero-text  md:text-2xl font-sans from-neutral-100 mt-2 tracking-tighter"
            style={{ color: "#070000" }}
          >
            WELCOME TO
          </h1>
        </div>
        <div className="h-20">
          <p
            className="text-2xl md:text-6xl mt-2 font-normal tracking-tighter"
            style={{ color: "#8d80bc" }}
          >
            Your Second Brain
          </p>
        </div>
        <div className="h-5 mt-3 flex gap-2">
          <p className="text-2xl font-mono text-black tracking-tight">
            Virtue without
          </p>
          <p className="text-2xl font-mono text-black italic tracking-tight">
            capacity collapse the moment
          </p>
          <p className="text-2xl font-mono text-black tracking-tight ">
            it is tested
          </p>
        </div>
        <div id="svg" className="w-full h-114 flex items-center justify-center">
          <svg
            viewBox="200 150 400 300"
            className="w-full h-full"
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
              className={isAnimating ? "pointer-events-none" : "cursor-pointer"}
            />
          </svg>
        </div>
        <div className="text-center -translate-y-10 cursor-pointer">
          <button
            onClick={() =>
              islogin ? navigate("/Dashboard") : navigate("/signup")
            }
            className="px-12 py-2 cursor-pointer text-lg font-semibold text-black rounded-full  transition"
            style={{
              opacity: 1,
              transform: "none",
              boxShadow: "rgb(0, 0, 0) 0px 0px 20px 0px inset",
            }}
          >
            Get Started
          </button>
        </div>
      </section>
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <footer id="bis" className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4
                className="font-bold text-lg mb-4"
                style={{ color: "#8d80bc" }}
              >
                CONCIOUS
              </h4>
              <p className="text-sm text-gray-600">
                Your digital conciousness, expanded.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-3" style={{ color: "#070000" }}>
                Product
              </h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:opacity-70">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3" style={{ color: "#070000" }}>
                Company
              </h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:opacity-70">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3" style={{ color: "#070000" }}>
                Connect
              </h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:opacity-70">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2026 Concious. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;
