import { AccountsSkeleton } from "@/components/account/accounts-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { Suspense } from "react";
import { AccountsContent } from "./components/accounts-content";

export default async function AccountsPage() {
    const { language, currency } = await getUserConfig();

    return (
        <div className="flex-1 w-full bg-background pb-32">
            <Suspense fallback={<AccountsSkeleton />}>
                <AccountsContent language={language} currency={currency} />
            </Suspense>
        </div>
    );
}

