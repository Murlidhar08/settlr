"use client";

import { Currency } from "@/lib/generated/prisma/enums";
import { formatAmount } from "@/utility/transaction";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface CountUpProps {
  value: number;
  currency: Currency;
  duration?: number;
  delay?: number;
  isLoading?: boolean;
}

export function CountUp({ value, currency, duration = 0.2, delay = 0, isLoading = false }: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatAmount(latest, currency));

  useEffect(() => {
    if (isLoading) return;

    const controls = animate(count, value, {
      duration: duration,
      delay: delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value, duration, delay, isLoading]);

  if (isLoading) {
    return (
      <span className="inline-block h-[0.75em] w-24 bg-current/10 rounded-md relative overflow-hidden align-middle">
        <motion.span
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-current/20 to-transparent"
        />
        <motion.span
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-current/5"
        />
      </span>
    );
  }

  return <motion.span>{rounded}</motion.span>;
}
