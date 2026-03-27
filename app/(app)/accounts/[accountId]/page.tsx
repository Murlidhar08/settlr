import { getAccountStats, getAccountTransactions } from "@/actions/transaction.actions";
import { getUserConfig } from "@/lib/user-config";
import { Suspense } from "react";
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
    const [{ account, transactions, totalTransactions }, stats, userConfig] = await Promise.all([
        getAccountTransactions(accountId, { page: 1, limit: 20 }),
        getAccountStats(accountId),
        getUserConfig()
    ]);

    return (
        <AccountDetailsView
            account={account}
            initialTransactions={transactions}
            totalTransactions={totalTransactions}
            stats={stats}
            currency={userConfig.currency}
            language={userConfig.language}
        />
    );
}
