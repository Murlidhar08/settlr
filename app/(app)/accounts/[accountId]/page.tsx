import { getUserConfig } from "@/lib/user-config";
import { Suspense } from "react";
import { AccountDetailsSkeleton } from "./components/account-details-skeleton";
import { AccountDetailsView } from "./components/account-details-view";

export default async function AccountDetailsPage({ params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;
    const { currency } = await getUserConfig();

    return (
        <Suspense fallback={<AccountDetailsSkeleton />}>
            <AccountDetailsView
                accountId={accountId}
                currency={currency}
            />
        </Suspense>
    );
}
