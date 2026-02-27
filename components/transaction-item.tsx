"use client"

import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, ArrowRight, Wallet2, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/utility/transaction"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { getTransactionPerspective, getPartyTransactionPerspective, getBusinessTransactionPerspective } from "@/lib/transaction-logic"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"

interface TransactionProp {
  transactionId: string
  title?: string
  subtitle?: string
  amount: number | string
  accountId?: string | null
  accountType?: string | null
  fromAccountId: string
  toAccountId: string
  fromAccount?: string
  toAccount?: string
  fromAccountType?: string
  toAccountType?: string
  partyName?: string
  currency?: string
}

const TransactionItem = ({
  transactionId,
  title,
  subtitle,
  amount,
  accountId,
  accountType,
  fromAccountId,
  toAccountId,
  fromAccount,
  toAccount,
  fromAccountType,
  toAccountType,
  partyName,
  currency
}: TransactionProp) => {
  // Determine direction based on context
  const direction = accountId
    ? (accountType === "PARTY"
      ? getPartyTransactionPerspective(toAccountId, fromAccountId, accountId)
      : getTransactionPerspective(toAccountId, fromAccountId, accountId))
    : getBusinessTransactionPerspective(toAccountType, fromAccountType);

  const isIn = direction === TransactionDirection.IN;
  const isNeutral = direction === TransactionDirection.NEUTRAL;

  // Smart Title Logic
  const displayTitle = title || partyName || (isNeutral ? "Balance Transfer" : isIn ? "Payment Received" : "Payment Sent");

  // Icon Selection
  const renderIcon = () => {
    if (isNeutral) return <Wallet2 size={18} className="text-indigo-500" />;
    return isIn ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.005, y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="w-full"
    >
      <Link href={`/transactions/${transactionId}`} className="block group">
        <div className="flex items-center gap-4 p-4 rounded-[1.5rem] border bg-card/40 backdrop-blur-sm transition-all hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 active:bg-muted/50">
          {/* Icon Container */}
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-12",
            isNeutral
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"
              : isIn
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
          )}>
            {renderIcon()}
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {displayTitle}
              </h4>
              {partyName && title && (
                <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                  <Tag size={8} /> {partyName}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-3">
              {subtitle && (
                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide italic">
                  {subtitle}
                </span>
              )}

              {(fromAccount || toAccount) && (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/40 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/50 border border-muted-foreground/5">
                  <span className="truncate max-w-[70px]">{fromAccount || '...'}</span>
                  <ArrowRight size={8} className="opacity-40" />
                  <span className="truncate max-w-[70px] text-foreground/40">{toAccount || '...'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Section */}
          <div className="shrink-0 text-right">
            <p className={cn(
              "text-lg font-black tabular-nums tracking-tighter",
              isNeutral
                ? "text-indigo-600 dark:text-indigo-400"
                : isIn
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
            )}>
              {isNeutral ? "" : isIn ? "+" : "-"}{formatAmount(Number(amount), currency as any, false)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export { TransactionItem }
