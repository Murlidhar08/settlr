import TransactionItem from "./transaction-item";
import { ArrowDownLeft, ArrowUpRight, Wallet2 } from "lucide-react";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { format } from "date-fns";
import { formatAmount, formatDate } from "@/utility/transaction";

import { getUserConfig } from "@/lib/user-config";
import { FinancialAccountType } from "@/lib/generated/prisma/enums";

export default async function RecentTransaction() {
  const recentTransactions = await getRecentTransactions();
  const { currency, dateFormat } = await getUserConfig();

  // ---------------------
  // Functions
  const getTransactionTitle = (tx: any) => {
    if (tx.description && tx.description.trim().length > 0)
      return tx.description;

    const fromType = tx.fromAccount?.type;
    const toType = tx.toAccount?.type;

    if (fromType === FinancialAccountType.MONEY && toType === FinancialAccountType.MONEY) {
      return `Transfer: ${tx.fromAccount.name} to ${tx.toAccount.name}`;
    }

    if (!tx.party?.name) {
      return "Cashbook Entry"
    }

    return toType === FinancialAccountType.MONEY
      ? "Payment Received"
      : "Payment Sent";
  };

  const getTransactionIcon = (tx: any) => {
    const fromType = tx.fromAccount?.type;
    const toType = tx.toAccount?.type;

    if (fromType === FinancialAccountType.MONEY && toType === FinancialAccountType.MONEY) {
      return <Wallet2 className="text-indigo-500" />
    }

    if (!tx.party?.name) return <Wallet2 />

    return toType !== FinancialAccountType.MONEY
      ? <ArrowUpRight /> : <ArrowDownLeft />
  }

  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">
          No transactions yet
        </p>
      )}

      {recentTransactions.map((tx) => {
        const isFromMoney = tx.fromAccount?.type === FinancialAccountType.MONEY;
        const isToMoney = tx.toAccount?.type === FinancialAccountType.MONEY;

        let type: 'in' | 'out' | 'neutral' = 'neutral';
        if (isToMoney && !isFromMoney) type = 'in';
        else if (isFromMoney && !isToMoney) type = 'out';
        else if (isFromMoney && isToMoney) type = 'neutral';

        return (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            icon={getTransactionIcon(tx)}
            title={getTransactionTitle(tx)}
            meta={formatDate(tx.date, dateFormat)}
            amount={formatAmount(Number(tx.amount), currency, false)}
            type={type}
            fromAccount={tx.fromAccount?.name}
            toAccount={tx.toAccount?.name}
          />
        );
      })}
    </div>
  );
}
