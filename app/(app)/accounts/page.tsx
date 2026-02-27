import { Suspense } from "react";
import { AccountsSkeleton } from "@/components/account/accounts-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { AccountsContent } from "./components/accounts-content";

export default async function AccountsPage() {
    const { language } = await getUserConfig();

    return (
        <div className="flex-1 w-full bg-background min-h-screen pb-32">
            <Suspense fallback={<AccountsSkeleton />}>
                <AccountsContent language={language} />
            </Suspense>
        </div>
    );
}

