"use client"

import { useAccountsDistribution } from "@/tanstacks/dashboard"
import { AccountsDistributionClient } from "./accounts-distribution-client"
import { Skeleton } from "@/components/ui/skeleton"

export function AccountsDistribution() {
    const { data: distributionData, isPending } = useAccountsDistribution()

    if (isPending) {
        return <Skeleton className="h-112.5 w-full rounded-[2.5rem] bg-muted/40 animate-pulse border-2 border-dashed border-muted" />
    }

    return <AccountsDistributionClient data={distributionData || []} />
}
