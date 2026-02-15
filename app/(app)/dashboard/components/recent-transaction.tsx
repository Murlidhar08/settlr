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
  const getTransactionTitle = (description: string | null, toAccountType: string, partyName?: string) => {
    if (description && description.trim().length > 0)
      return description;

    if (!partyName) {
      return "Cashbook"
    }

    return toAccountType === "MONEY"
      ? "Payment Received"
      : "Payment Sent";
  };

  const getTransactionIcon = (toAccountType: string, partyName?: string) => {
    if (!partyName) return <Wallet2 />

    return toAccountType !== "MONEY"
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
        const positive = tx.toAccount?.type === "MONEY";

        return (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            icon={getTransactionIcon(tx.toAccount?.type as string, tx.party?.name)}
            title={getTransactionTitle(tx.description, tx.toAccount?.type as string, tx.party?.name)}
            meta={`${format(tx.date, "dd MMM")}${tx.party?.name ? ` • ${tx.party.name}` : ""}`}
            amount={formatAmount(Number(tx.amount), currency, true)}
            positive={positive}
            fromAccount={tx.fromAccount?.name}
            toAccount={tx.toAccount?.name}
          />
        );
      })}
    </div>
  );
}
