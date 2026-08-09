import { getRecentTransactions } from "@/actions/transaction.actions";
import { TransactionItem } from "@/components/transaction/transaction-item";
import { FormattedDate } from "@/components/ui/date-time";
import { tran } from "@/lib/languages/i18n";

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
          <TransactionItem
            key={tx.id}
            transactionId={tx.id}
            title={tx.description || ""}
            subtitle={<FormattedDate date={tx.date} />}
            amount={Number(tx.amount)}
            fromAccountId={tx.fromAccountId}
            toAccountId={tx.toAccountId}
            fromAccount={tx.fromAccount?.name}
            toAccount={tx.toAccount?.name}
            fromAccountType={tx.fromAccount?.type}
            toAccountType={tx.toAccount?.type}
            partyName={tx.party?.name}
          />
        );
      })}
    </div>
  );
}
