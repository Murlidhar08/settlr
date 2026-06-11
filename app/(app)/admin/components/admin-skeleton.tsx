import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
    return (
        <div className="flex-1 px-4 space-y-8 pb-32 pt-6 animate-pulse">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-muted/10 border border-border/50 p-5 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-8 w-12" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>

            {/* Filter Bar Skeleton */}
            <div className="p-5 rounded-3xl bg-muted/5 border-2 border-primary/5 space-y-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <div className="flex gap-3">
                    <Skeleton className="h-11 w-32 rounded-2xl" />
                    <Skeleton className="h-11 w-32 rounded-2xl" />
                    <Skeleton className="h-11 w-32 rounded-2xl" />
                </div>
            </div>

            {/* Users List Skeleton */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-border/60 bg-muted/5 gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                            <div className="flex items-center gap-8 mr-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-6 w-8" />
                                    <Skeleton className="h-2 w-10" />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-6 w-8" />
                                    <Skeleton className="h-2 w-10" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
