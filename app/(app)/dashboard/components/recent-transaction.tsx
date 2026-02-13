import { TransactionDirection } from "@/types/enums";
import TransactionItem from "./transaction-item";
import { ArrowDownLeft, ArrowUpRight, Wallet2 } from "lucide-react";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { format } from "date-fns";
import { formatAmount } from "@/utility/transaction";

import { getUserConfig } from "@/lib/user-config";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();
  const { currency } = await getUserConfig();

  // ---------------------
  // Functions
  const getTransactionTitle = (description: string | null, direction: TransactionDirection, partyName?: string) => {
    if (description && description.trim().length > 0)
      return description;

    if (!partyName) {
      return "Transaction"
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
        // Deriving direction: 
        // If money went TO a Cash/Bank account -> IN (Receipt)
        // If money went FROM a Cash/Bank account -> OUT (Payment)
        const isToCash = ["CASH", "BANK"].includes(tx.toAccount.type);
        const direction = isToCash ? TransactionDirection.IN : TransactionDirection.OUT;

        const positive = direction === TransactionDirection.IN;

        const otherPartyName = isToCash ? tx.fromAccount.name : tx.toAccount.name;

        return (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            icon={getTransactionIcon(direction, tx.party?.name)}
            title={getTransactionTitle(tx.description, direction, tx.party?.name)}
            meta={`${format(tx.date, "dd MMM")} • ${otherPartyName}`}
            amount={formatAmount(Number(tx.amount), currency, true, direction)}
            positive={positive}
          />
        );
      })}
    </div>
  );
}
