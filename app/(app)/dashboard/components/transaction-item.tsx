"use client";

import { FinancialAccountType } from "@/lib/generated/prisma/enums";
import { getBusinessTransactionPerspective, getPartyTransactionPerspective, getTransactionPerspective } from "@/lib/transaction-logic";
import { cn } from "@/lib/utils";
import { TransactionDirection } from "@/types/transaction/TransactionDirection";
import { formatAmount } from "@/utility/transaction";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Wallet2 } from "lucide-react";
import Link from "next/link";
import { FormattedDate } from "@/components/ui/date-time";

interface TransactionProp {
  transactionId: string;
  title: string;
  amount: number | string;
  date: Date | string | number;
  currency: string;
  accountId?: string | null;
  accountType?: string | null;
  fromAccountId: string;
  toAccountId: string;
  fromAccountType?: string;
  toAccountType?: string;
}

export function DashboardTransactionItem({
  transactionId,
  title,
  amount,
  date,
  currency,
  accountId,
  accountType,
  fromAccountId,
  toAccountId,
  fromAccountType,
  toAccountType,
}: TransactionProp) {
  const direction = accountId
    ? (accountType === FinancialAccountType.PARTY
      ? getPartyTransactionPerspective(toAccountId, fromAccountId, accountId)
      : getTransactionPerspective(toAccountId, fromAccountId, accountId))
    : getBusinessTransactionPerspective(toAccountType, fromAccountType);

  const isIn = direction === TransactionDirection.IN;
  const isNeutral = direction === TransactionDirection.NEUTRAL;

  const displayTitle = title || (isNeutral ? "Balance Transfer" : isIn ? "Payment Received" : "Payment Sent");

  const renderIcon = () => {
    if (isNeutral) return <Wallet2 size={16} className="text-indigo-500" />;
    return isIn ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      className="group"
    >
      <Link href={`/transactions/${transactionId}` as any} className="flex items-center gap-4 p-3 rounded-2xl border border-muted-foreground/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          isNeutral
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"
            : isIn
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
              : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
        )}>
          {renderIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="truncate text-sm font-bold text-foreground">
            {displayTitle}
          </h4>
          <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mt-0.5">
            <FormattedDate date={date} />
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className={cn(
            "text-sm font-black tabular-nums tracking-tight",
            isNeutral
              ? "text-indigo-600 dark:text-indigo-400"
              : isIn
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
          )}>
            {isNeutral ? "" : isIn ? "+" : "-"}{formatAmount(Number(amount), currency as any, false)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
