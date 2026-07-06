import { motion, useAnimation } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { useEffect } from "react";

type Testimonial = {
  name: string;
  mobileName?: string;
  role: string;
  text: string;
  mobileText?: string;
};

function getScrollDuration() {
  if (typeof window === "undefined") return 30;

  if (window.matchMedia("(max-width: 639px)").matches) return 22;
  if (window.matchMedia("(max-width: 1023px)").matches) return 26;
  return 30;
}

export function MovingRow({
  testimonials,
  direction = "left",
}: {
  testimonials: Testimonial[];
  direction?: "left" | "right";
}) {
  const controls = useAnimation();

  const startAnimation = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    controls.start({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        repeat: Infinity,
        duration: getScrollDuration(),
        ease: "linear",
      },
    });
  };

  useEffect(() => {
    startAnimation();
  }, [controls, direction]);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max gap-2.5 sm:gap-3 md:gap-4 lg:gap-6"
        animate={controls}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="shrink-0"
            onMouseEnter={() => controls.stop()}
            onMouseLeave={startAnimation}
            onTouchStart={() => controls.stop()}
            onTouchEnd={startAnimation}
          >
            <TestimonialCard {...t} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
