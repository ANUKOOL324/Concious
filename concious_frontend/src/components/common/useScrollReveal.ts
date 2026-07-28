import { useReducedMotion, type MotionProps } from "framer-motion";

interface RevealOptions {
  delay?: number;
  lift?: number;
}

export function useScrollReveal() {
  const reduceMotion = useReducedMotion();

  return function reveal({ delay = 0, lift = 0 }: RevealOptions = {}): MotionProps {
    if (reduceMotion) {
      return {};
    }

    const props: MotionProps = {
      initial: { opacity: 0, y: 22 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.5, delay, ease: "easeOut" },
    };

    if (lift > 0) {
      props.whileHover = {
        y: -lift,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      };
      props.whileTap = { scale: 0.98 };
    }

    return props;
  };
}
