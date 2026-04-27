"use client";

import { AnimatePresence, motion } from "framer-motion";

interface LoadingTextProps {
  value?: string;
}

export default function LoadingText({ value }: LoadingTextProps) {
  return (
    <motion.span
      layout
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
        opacity: { duration: 0.2 }
      }}
      className="inline-block whitespace-nowrap"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value || "loading"}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {value || "Loading..."}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
