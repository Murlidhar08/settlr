import { Skeleton } from "@/components/ui/skeleton";

export function CashbookSkeleton() {
    return (
        <div className="w-full bg-background animate-pulse mt-8">
            <div className="mx-auto w-full max-w-4xl space-y-8">
                {/* Summary Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-40 rounded-[2rem] bg-muted/10 border border-border/50 p-6 space-y-4">
                         <div className="flex items-center gap-2">
                             <Skeleton className="h-4 w-4 rounded-full" />
                             <Skeleton className="h-3 w-20" />
                         </div>
                         <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="h-40 rounded-[2rem] bg-muted/10 border border-border/50 p-6 space-y-4">
                         <div className="flex items-center gap-2">
                             <Skeleton className="h-4 w-4 rounded-full" />
                             <Skeleton className="h-3 w-20" />
                         </div>
                         <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Transaction List Skeleton */}
                <div className="space-y-4">
                    <div className="px-2">
                         <Skeleton className="h-3 w-24" />
                    </div>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
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
            </div>
        </div>
    );
}
