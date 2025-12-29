"use client";

import { format, isToday, isYesterday } from "date-fns";
import { AddTransactionModal } from "./add-transaction-modal";
import { Transaction } from "@/lib/generated/prisma/client";
import { TransactionItem } from "@/components/transaction-item";

interface transactionListProp {
  transactions: Transaction[]
  partyId?: string | null
}

function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};

  for (const tx of transactions) {
    let label = "";

    if (isToday(tx.date)) {
      label = "TODAY";
    } else if (isYesterday(tx.date)) {
      label = "YESTERDAY";
    } else {
      label = format(tx.date, "dd MMM, yyyy");
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(tx);
  }

  return groups;
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

const TransactionList = ({ transactions, partyId }: transactionListProp) => {
  return (
    <div className="flex flex-col gap-4 px-1">

      {transactions &&
        Object.entries(groupTransactionsByDate(transactions))
          .map(([label, transactions]) => (
            <TransactionGroup key={label} label={label}>
              {transactions.map((transaction) => (
                // <AddTransactionModal
                //   key={transaction.id}
                //   title="Add Transaction"
                //   partyId={partyId}
                //   transactionData={transaction}
                // >
                <TransactionItem
                  key={transaction.id}
                  transactionId={transaction.id}
                  title={transaction.description || ""}
                  subtitle={format(transaction.date, "hh:mm a")}
                  amount={String(transaction.amount)}
                  type={transaction.direction}
                  mode={transaction.mode}
                />
                // </AddTransactionModal>
              ))}
            </TransactionGroup>
          ))}

    </div>
  )
}

export { TransactionList }
