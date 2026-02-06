
"use client"

import { motion } from "framer-motion";

interface CashSummaryProp {
  totalIn: number
  totalOut: number
}

export default function CashSummary({
  totalIn,
  totalOut,
}: CashSummaryProp) {
  const cashBalance = totalIn - totalOut
  const isPositive = cashBalance >= 0

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
      className="mt-6 rounded-3xl bg-background p-6 shadow-sm border"
    >
      <p className="text-center text-xs uppercase text-muted-foreground font-bold tracking-widest">
        Total Cash Balance
      </p>

      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`mt-2 text-center text-4xl font-extrabold lg:text-5xl ${isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
      >
        ₹{formatAmount(Math.abs(cashBalance))}
      </motion.h2>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {/* Total In */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-emerald-50/50 p-4 text-center border border-emerald-100"
        >
          <p className="text-xl font-bold text-emerald-600">
            +₹{formatAmount(totalIn)}
          </p>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total In</span>
        </motion.div>

        {/* Total Out */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-rose-50/50 p-4 text-center border border-rose-100"
        >
          <p className="text-xl font-bold text-rose-600">
            -₹{formatAmount(totalOut)}
          </p>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Out</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

