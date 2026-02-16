"use client";

import { format, isToday, isYesterday } from "date-fns";
import { TransactionItem } from "@/components/transaction-item";
import { TransactionRes } from "@/types/transaction/TransactionData";
import { formatAmount } from "@/utility/transaction";
import { useUserConfig } from "@/components/providers/user-config-provider";

interface transactionListProp {
  transactions: TransactionRes[]
  partyId?: string | null
  accountId?: string | null
  accountType?: string | null
}

function groupTransactionsByDate(transactions: TransactionRes[]) {
  const groups: Record<string, TransactionRes[]> = {};

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

const TransactionList = ({ transactions, accountId, accountType }: transactionListProp) => {
  const { currency } = useUserConfig();
  return (
    <div className="flex flex-col gap-4 px-1">
      {/* No Records */}
      {!transactions?.length && (
        <p className="text-sm text-slate-500">
          No transactions yet
        </p>
      )}

      {/* List Of All Transactions */}
      {transactions &&
        Object.entries(groupTransactionsByDate(transactions))
          .map(([label, transactions]) => (
            <TransactionGroup key={label} label={label}>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transactionId={transaction.id}
                  title={transaction.description || ""}
                  subtitle={format(transaction.date, "hh:mm a")}
                  amount={formatAmount(transaction.amount, currency, true)}
                  accountId={accountId}
                  accountType={accountType}
                  fromAccountId={transaction.fromAccountId}
                  toAccountId={transaction.toAccountId}
                  fromAccount={transaction.fromAccount?.name}
                  toAccount={transaction.toAccount?.name}
                  fromAccountType={transaction.fromAccount?.type}
                  toAccountType={transaction.toAccount?.type}
                />
              ))}
            </TransactionGroup>
          ))}

    </div>
  )
}

export { TransactionList }
