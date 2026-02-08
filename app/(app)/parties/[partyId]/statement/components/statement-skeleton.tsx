"use client";

import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatementSkeleton() {
    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="mx-auto mt-6 max-w-4xl space-y-8 px-6">
                {/* Profile Skeleton */}
                <section className="flex flex-col items-center px-6 pb-8 pt-4 text-center">
                    <div className="h-24 w-24 rounded-full bg-muted animate-pulse mb-4" />
                    <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-2" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded-lg" />
                </section>

                {/* Transactions Header Skeleton */}
                <div className="flex items-center justify-between px-2">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded-lg" />
                    <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
                </div>

                {/* Filter Skeletons */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded-full shrink-0" />
                    ))}
                </div>

                {/* Transaction Groups Skeleton */}
                <div className="space-y-6">
                    {[1, 2].map((g) => (
                        <div key={g} className="space-y-3">
                            <div className="h-4 w-16 bg-muted/60 animate-pulse rounded px-2" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Bottom Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-xl p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="h-20 bg-muted/30 animate-pulse rounded-2xl" />
                        <div className="h-20 bg-muted/30 animate-pulse rounded-2xl" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted/60 animate-pulse rounded" />
                            <div className="h-8 w-40 bg-muted/60 animate-pulse rounded" />
                        </div>
                        <div className="h-14 w-32 bg-primary/20 animate-pulse rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
