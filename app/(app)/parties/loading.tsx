import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full bg-background min-h-screen max-w-4xl mx-auto px-6 py-8">
            <div className="space-y-8">
                {/* Search & Tabs Skeleton */}
                <div className="space-y-6">
                    <Skeleton className="h-14 w-full rounded-2xl border-2" />
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Summary Skeleton */}
                <div className="h-28 w-full rounded-2xl bg-muted/20 border-2 border-dashed border-muted animate-pulse" />

                {/* List Skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-muted/50">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 rounded" />
                                    <Skeleton className="h-3 w-20 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-24 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
