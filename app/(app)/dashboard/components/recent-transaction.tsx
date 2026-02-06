import { TransactionDirection } from "@/lib/generated/prisma/enums";
import TransactionItem from "./transaction-item";
import { ArrowDownLeft, ArrowUpRight, Wallet2 } from "lucide-react";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { format } from "date-fns";
import { formatAmount } from "@/utility/transaction";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();

  // Temp
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  // ---------------------
  // Functions
  const getTransactionTitle = (description: string | null, direction: TransactionDirection, partyName?: string) => {
    if (description && description.trim().length > 0)
      return description;

    if (!partyName) {
      return "Cashbook"
    }

    return direction === TransactionDirection.IN
      ? "Payment Received"
      : "Payment Sent";
  };

  const getTransactionIcon = (direction: TransactionDirection, partyName?: string) => {
    if (!partyName) return <Wallet2 />

    return direction == TransactionDirection.OUT
      ? <ArrowUpRight /> : <ArrowDownLeft />
  }

  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 && (
        <p className="text-sm text-slate-500">
          No transactions yet
        </p>
      )}

      {recentTransactions.map((tx) => {
        const positive = tx.direction === TransactionDirection.IN;

        return (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            icon={getTransactionIcon(tx.direction, tx.party?.name)}
            title={getTransactionTitle(tx.description, tx.direction, tx.party?.name)}
            meta={`${format(tx.date, "dd MMM")} • ${tx.mode}${tx.party?.name ? ` • ${tx.party.name}` : ""}`}
            amount={formatAmount(Number(tx.amount), undefined, true, tx.direction)}
            positive={positive}
          />
        );
      })}
    </div>
  );
}
