import { AccountsSkeleton } from "@/components/account/accounts-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { Suspense } from "react";
import { AccountsContent } from "./components/accounts-content";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const { language, currency } = await getUserConfig();
    const includeInactive = params.inactive === 'true';

    return (
        <div className="flex-1 w-full bg-background pb-34">
            <Suspense fallback={<AccountsSkeleton />}>
                <AccountsContent
                    language={language}
                    currency={currency}
                    initialShowInactive={includeInactive}
                />
            </Suspense>
        </div>
    );
}