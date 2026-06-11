import { getRecentTransactions } from "@/actions/transaction.actions";
import { tran } from "@/lib/languages/i18n";
import { DashboardTransactionItem } from "./transaction-item";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();

  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">
          {tran("dashboard.no_transactions")}
        </p>
      )}

      {recentTransactions.map((tx) => {
        return (
          <DashboardTransactionItem
            key={tx.id}
            transactionId={tx.id}
            title={tx.description || ""}
            date={tx.date}
            amount={Number(tx.amount)}
            fromAccountId={tx.fromAccountId}
            toAccountId={tx.toAccountId}
            fromAccountType={tx.fromAccount?.type}
            toAccountType={tx.toAccount?.type}
          />
        );
      })}
    </div>
  );
}
