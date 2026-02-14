"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TransactionProp {
  transactionId: string,
  title: string,
  subtitle: string,
  amount: string,
  mode: PaymentMode
  type: TransactionDirection,
  fromAccount?: string,
  toAccount?: string
}

const TransactionItem = ({
  transactionId,
  title,
  subtitle,
  amount,
  type,
  mode,
  fromAccount,
  toAccount
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
            <div className="flex items-center gap-2 mb-0.5">
              <p className="truncate text-sm font-bold lg:text-base text-foreground">
                {title || (isIn ? "Payment Received" : "Payment Sent")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{mode}</span>

              {(fromAccount || toAccount) && (
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70">
                  <span className="truncate max-w-[80px]">{fromAccount || "Unknown"}</span>
                  <ArrowRight size={10} className="opacity-50" />
                  <span className="truncate max-w-[80px] font-bold text-foreground/60">{toAccount || "Unknown"}</span>
                </div>
              )}

              <span className="text-[10px] text-muted-foreground/60 ml-auto">{subtitle}</span>
            </div>
          </div>

          <div className="shrink-0 text-right mr-2 ml-4">
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
