import { motion, useAnimation } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { useEffect } from "react";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export function MovingRow({
  testimonials,
  direction = "left",
}: {
  testimonials: Testimonial[];
  direction?: "left" | "right";
}) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        repeat: Infinity,
        duration: 30,
        ease: "linear",
      },
    });
  }, [controls, direction]);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 w-max"
        animate={controls}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() =>
              controls.start({
                x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                transition: {
                  repeat: Infinity,
                  duration: 30,
                  ease: "linear",
                },
              })
            }
            onTouchStart={() => controls.stop()}
            onTouchEnd={() =>
              controls.start({
                x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                transition: {
                  repeat: Infinity,
                  duration: 30,
                  ease: "linear",
                },
              })
            }
          >
            <TestimonialCard {...t} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
