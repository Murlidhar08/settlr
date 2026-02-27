import { TransactionItem } from "@/components/transaction-item";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { formatDate } from "@/utility/transaction";

import { getUserConfig } from "@/lib/user-config";
import { t } from "@/lib/languages/i18n";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();
  const { currency, dateFormat, language } = await getUserConfig();

  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">
          {t("dashboard.no_transactions", language)}
        </p>
      )}

      {recentTransactions.map((tx) => {
        return (
          <TransactionItem
            key={tx.id}
            transactionId={tx.id}
            title={tx.description || ""}
            subtitle={formatDate(tx.date, dateFormat)}
            amount={Number(tx.amount)}
            currency={currency}
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
