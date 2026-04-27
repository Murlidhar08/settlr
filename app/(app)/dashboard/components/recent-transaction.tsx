import { getRecentTransactions } from "@/actions/transaction.actions";
import { DashboardTransactionItem } from "./transaction-item";
import { t } from "@/lib/languages/i18n";
import { getUserConfig } from "@/lib/user-config";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();
  const { currency, language } = await getUserConfig();

  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">
          {t("dashboard.no_transactions", language)}
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
            currency={currency}
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
