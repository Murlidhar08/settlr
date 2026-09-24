"use client";

import { TransactionItem } from "@/components/transaction/transaction-item";
import { FormattedTime } from "@/components/ui/date-time";
import { TransactionRes } from "@/types/transaction/TransactionData";
import { formatUserDate } from "@/utility/date-time-fn";
import { isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { Wallet2 } from "lucide-react";

interface transactionListProp {
  transactions: TransactionRes[]
  partyId?: string | null
  accountId?: string | null
  accountType?: string | null
  groupByDate?: boolean
}

function TransactionGroup({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-start justify-start my-2">
        <span className="px-3 py-1 rounded-full bg-muted/40 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border border-muted-foreground/5 backdrop-blur-sm">
          {typeof label === "string" ? label : label}
        </span>
      </div>
      <div className="flex flex-col gap-1 w-full">
        {children}
      </div>
    </div>
  )
}

const TransactionList = ({ transactions, accountId, accountType, groupByDate = true }: transactionListProp) => {
  function groupTransactionsByDate(transactions: TransactionRes[]) {
    const groups: Record<string, TransactionRes[]> = {};

    for (const tx of transactions) {
      let label = "";

      if (isToday(tx.date)) {
        label = "TODAY";
      } else if (isYesterday(tx.date)) {
        label = "YESTERDAY";
      } else {
        label = formatUserDate(tx.date); // We use the date as the key, but we'll format it in the Group label
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
      {transactions && transactions.length > 0 && (
        groupByDate ? (
          Object.entries(groupTransactionsByDate(transactions))
            .map(([label, groupTxs]) => (
              <TransactionGroup
                key={label}
                label={label}
              >
                <div className="space-y-2 mt-1">
                  {groupTxs.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transactionId={transaction.id}
                      title={transaction.description || ""}
                      subtitle={<FormattedTime date={transaction.date} />}
                      amount={transaction.amount}
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
            ))
        ) : (
          <div className="space-y-2 mt-1">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transactionId={transaction.id}
                title={transaction.description || ""}
                subtitle={<FormattedTime date={transaction.date} />}
                amount={transaction.amount}
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
        )
      )}
    </motion.div>
  )
}

export { TransactionList };

