import { getUserConfig } from "@/lib/user-config";
import { Suspense } from "react";
import { AccountDetailsView } from "./components/account-details-view";
import { AccountDetailsSkeleton } from "./components/account-details-skeleton";

export default async function AccountDetailsPage({ params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;
    const { currency, language } = await getUserConfig();

    return (
        <Suspense fallback={<AccountDetailsSkeleton />}>
            <AccountDetailsView
                accountId={accountId}
                currency={currency}
                language={language}
            />
        </Suspense>
    );
}
