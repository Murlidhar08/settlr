import { Suspense } from "react";
import { getAccountTransactions } from "@/actions/transaction.actions";
import { calculateAccountStats } from "@/lib/transaction-logic";
import { getUserConfig } from "@/lib/user-config";
import { AccountDetailsView } from "./components/account-details-view";

export default async function AccountDetailsPage({ params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;

    return (
        <Suspense fallback={null}>
            <AccountContent accountId={accountId} />
        </Suspense>
    );
}

async function AccountContent({ accountId }: { accountId: string }) {
    const { account, transactions } = await getAccountTransactions(accountId);
    const userConfig = await getUserConfig();

    const { totalIn, totalOut, balance } = calculateAccountStats(transactions, accountId, account.type);

    return (
        <AccountDetailsView
            account={account}
            transactions={transactions}
            stats={{ totalIn, totalOut, balance }}
            currency={userConfig.currency}
            language={userConfig.language}
        />
    );
}
