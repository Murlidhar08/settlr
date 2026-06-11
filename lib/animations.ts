import { Transition } from "framer-motion";

/**
 * Standard spring transition for layout changes and sidebar toggles.
 * Provides a snappy, high-quality feel.
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/**
 * Gentle fade transition for entry/exit animations.
 */
export const fadeTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

/**
 * Staggered animation configuration for lists.
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Gentle floating animation for cards, illustrations, or logos.
 */
export const floatAnimate = {
  y: [0, -10, 0],
};

export const floatTransition: Transition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut",
};
