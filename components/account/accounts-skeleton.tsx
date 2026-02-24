"use client"

import { Skeleton } from "@/components/ui/skeleton"

export const AccountsSkeleton = () => {
    return (
        <div className="w-full bg-background min-h-screen">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-40 h-20 w-full bg-background/80 border-b animate-pulse" />

            <div className="mx-auto w-full max-w-4xl px-6 py-8">
                {/* Title Section Skeleton */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-3">
                        <div className="h-3 w-32 bg-muted/20 rounded-full" />
                        <div className="h-10 w-56 bg-muted/20 rounded-2xl" />
                    </div>
                    <div className="h-14 w-40 bg-muted/20 rounded-2xl" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-32 w-full p-6 rounded-3xl border-2 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-muted/10 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-2/3 bg-muted/10 rounded-lg" />
                                    <div className="h-3 w-1/4 bg-muted/10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
