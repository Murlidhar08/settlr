"use client"

import { motion } from "framer-motion";
import { Currency } from "@/lib/generated/prisma/enums";
import { getCurrencySymbol } from "@/utility/transaction";

interface CashSummaryProp {
  totalIn: number
  totalOut: number
  currency?: Currency
}

export default function CashSummary({
  totalIn,
  totalOut,
  currency = Currency.INR,
}: CashSummaryProp) {
  const cashBalance = totalIn - totalOut
  const isPositive = cashBalance >= 0

  const symbol = getCurrencySymbol(currency)

  const formatAmount = (value: number) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-6 rounded-[2.5rem] bg-card p-8 shadow-xs border border-border/50 relative overflow-hidden"
    >
      <p className="text-center text-xs font-black uppercase text-muted-foreground tracking-[0.3em] opacity-70">
        Aggregate Cash Balance
      </p>

      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`mt-3 text-center text-5xl font-black lg:text-6xl tracking-tighter ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
      >
        {symbol}{formatAmount(Math.abs(cashBalance))}
      </motion.h2>

      <div className="mt-10 grid grid-cols-2 gap-4">
        {/* Total In */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[2rem] bg-emerald-50/50 dark:bg-emerald-500/5 p-6 text-center border border-emerald-100 dark:border-emerald-500/10 shadow-sm"
        >
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            +{symbol}{formatAmount(totalIn)}
          </p>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Inflow</span>
        </motion.div>

        {/* Total Out */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-[2rem] bg-rose-50/50 dark:bg-rose-500/5 p-6 text-center border border-rose-100 dark:border-rose-500/10 shadow-sm"
        >
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            -{symbol}{formatAmount(totalOut)}
          </p>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Outflow</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
