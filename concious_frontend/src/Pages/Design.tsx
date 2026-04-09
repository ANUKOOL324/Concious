import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { RadialGroup } from "../components/RadialGroup";
import { CenterBrand } from "../components/LockIcon";

export function Design(){
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const targetColor = isOpen ?"#8d80bc" : "#070000";

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(".radialGroup path", {
      stroke: targetColor,
      duration: 0.4,
      stagger: 0.08,
    })
      .to(
        ".radialGroup",
        {
          rotation: "+=36",
          svgOrigin: "400 300",
          ease: "elastic.out(0.6, 0.7)",
          duration: 1,
        },
        0
      );

    return () => {
      tl.kill();
    };
  }, [isOpen, isAnimating]);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
         <svg
                 viewBox="200 150 400 300"
                 className="w-full h-full fixed"
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
  );
};








               