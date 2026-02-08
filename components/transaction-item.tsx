"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TransactionProp {
  transactionId: string,
  title: string,
  subtitle: string,
  amount: string,
  mode: PaymentMode
  type: TransactionDirection
}

const TransactionItem = ({
  transactionId,
  title,
  subtitle,
  amount,
  type,
  mode,
}: TransactionProp) => {
  const isIn = type === TransactionDirection.IN

  return (
    <Link href={`/transactions/${transactionId}`} className="block p-1 outline-none group">
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="flex cursor-pointer flex-row items-center gap-4 p-4 transition-shadow hover:shadow-md border bg-card/50 backdrop-blur-sm group-focus-visible:ring-2 group-focus-visible:ring-primary">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
              isIn ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
            )}
          >
            {isIn ? (
              <ArrowDownLeft size={20} />
            ) : (
              <ArrowUpRight size={20} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-bold lg:text-base text-foreground">
              {title || (isIn ? "Payment Received" : "Payment Sent")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{mode}</span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>

          <div className="shrink-0 text-right mr-2">
            <p
              className={cn(
                "text-base font-extrabold lg:text-lg tabular-nums",
                isIn ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {amount}
            </p>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}

export { TransactionItem }
