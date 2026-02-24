import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
    return (
        <div className="w-full min-h-screen bg-background animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl bg-primary/5" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-muted/60" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-muted/40" />
                </div>
            </div>

            <div className="mx-auto w-full max-w-4xl px-6 py-8 space-y-12 mt-6">
                {/* Top Summary/Filter Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <Skeleton className="h-3 w-24 bg-muted/40" />
                        <Skeleton className="h-10 w-56 bg-muted/60" />
                    </div>
                    <Skeleton className="h-14 w-40 rounded-2xl bg-primary/10" />
                </div>

                {/* Content Section 1 */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-12 bg-linear-to-r from-primary/20 to-transparent rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-28 bg-muted/60" />
                            <Skeleton className="h-3 w-36 bg-muted/40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-6 rounded-3xl border border-border/50 bg-card/30 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-12 w-12 rounded-2xl bg-muted/60" />
                                    <Skeleton className="h-4 w-20 bg-muted/40" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4 bg-muted/60" />
                                    <Skeleton className="h-3 w-1/2 bg-muted/40" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Section 2 (List style) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32 bg-muted/60" />
                        <Skeleton className="h-3 w-16 bg-muted/40" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/30 bg-card/20">
                                <Skeleton className="h-10 w-10 rounded-xl bg-muted/50" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3 w-40 bg-muted/60" />
                                    <Skeleton className="h-2 w-24 bg-muted/40" />
                                </div>
                                <Skeleton className="h-4 w-16 bg-muted/60" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

