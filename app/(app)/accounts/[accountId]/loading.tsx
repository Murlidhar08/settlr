import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full bg-background min-h-screen">
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-6 py-4 border-b border-border/40 flex items-center justify-between">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <Skeleton className="h-11 w-11 rounded-2xl" />
            </header>

            <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-12">
                {/* Stats Summary Area Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 bg-muted/20 rounded-[2.5rem]" />
                    ))}
                </div>

                {/* Ledger Description Skeleton */}
                <Skeleton className="h-24 w-full bg-muted/10 rounded-[2.5rem]" />

                {/* Transaction List Skeleton */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-1 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-20 bg-muted/5 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
