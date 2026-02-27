"use client";

import { format, isToday, isYesterday } from "date-fns";
import { TransactionItem } from "@/components/transaction-item";
import { TransactionRes } from "@/types/transaction/TransactionData";
import { formatAmount, formatDate, formatTime } from "@/utility/transaction";
import { useUserConfig } from "@/components/providers/user-config-provider";
import { motion } from "framer-motion";
import { Wallet2 } from "lucide-react";

interface transactionListProp {
  transactions: TransactionRes[]
  partyId?: string | null
  accountId?: string | null
  accountType?: string | null
}

function TransactionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

const TransactionList = ({ transactions, accountId, accountType }: transactionListProp) => {
  const { currency, dateFormat, timeFormat } = useUserConfig();

  function groupTransactionsByDate(transactions: TransactionRes[]) {
    const groups: Record<string, TransactionRes[]> = {};

    for (const tx of transactions) {
      let label = "";

      if (isToday(tx.date)) {
        label = "TODAY";
      } else if (isYesterday(tx.date)) {
        label = "YESTERDAY";
      } else {
        label = formatDate(tx.date, dateFormat);
      }

      if (!groups[label]) {
        groups[label] = [];
      }

      groups[label].push(tx);
    }

    return groups;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 px-1"
    >
      {/* No Records */}
      {!transactions?.length && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
          <Wallet2 size={40} className="mb-2 opacity-20" />
          <p className="text-sm font-medium">No transactions yet</p>
        </div>
      )}

      {/* List Of All Transactions */}
      {transactions &&
        Object.entries(groupTransactionsByDate(transactions))
          .map(([label, groupTxs]) => (
            <TransactionGroup key={label} label={label}>
              <div className="space-y-2 mt-2">
                {groupTxs.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transactionId={transaction.id}
                    title={transaction.description || ""}
                    subtitle={formatTime(transaction.date, timeFormat)}
                    amount={transaction.amount}
                    currency={currency}
                    accountId={accountId}
                    accountType={accountType}
                    fromAccountId={transaction.fromAccountId}
                    toAccountId={transaction.toAccountId}
                    fromAccount={transaction.fromAccount?.name}
                    toAccount={transaction.toAccount?.name}
                    fromAccountType={transaction.fromAccount?.type}
                    toAccountType={transaction.toAccount?.type}
                    partyName={transaction.party?.name}
                  />
                ))}
              </div>
            </TransactionGroup>
          ))}
    </motion.div>
  )
}

export { TransactionList }
