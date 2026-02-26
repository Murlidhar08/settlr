import { Suspense } from "react";
import { AccountsSkeleton } from "@/components/account/accounts-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { AccountsContent } from "./components/accounts-content";

export default async function AccountsPage() {
    const { language } = await getUserConfig();

    return (
        <div className="w-full bg-background min-h-screen">
            <Suspense fallback={<AccountsSkeleton />}>
                <AccountsContent language={language} />
            </Suspense>
        </div>
    );
}

