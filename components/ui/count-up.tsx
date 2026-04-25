"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { formatAmount } from "@/utility/transaction";
import { Currency } from "@/lib/generated/prisma/enums";

interface CountUpProps {
  value: number;
  currency: Currency;
  duration?: number;
  delay?: number;
}

export function CountUp({ value, currency, duration = 1.5, delay = 0 }: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatAmount(latest, currency));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      delay: delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value, duration, delay]);

  return <motion.span>{rounded}</motion.span>;
}
