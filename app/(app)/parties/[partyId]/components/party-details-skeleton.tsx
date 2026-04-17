import { Skeleton } from "@/components/ui/skeleton";

export function PartyDetailsSkeleton() {
    return (
        <div className="relative w-full bg-background animate-pulse">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>

            <div className="mx-auto max-w-4xl mt-2 space-y-8 px-6">
                <main className="pb-24 space-y-8">
                    {/* Hero Balance Card Skeleton */}
                    <div className="h-28 w-full rounded-2xl bg-muted/20 border border-muted/30" />

                    {/* Quick Actions Skeleton */}
                    <div className="flex gap-4">
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                    </div>

                    {/* Search Bar Skeleton */}
                    <Skeleton className="h-12 w-full rounded-full" />

                    {/* Transactions List Skeleton */}
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/5">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-24" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
