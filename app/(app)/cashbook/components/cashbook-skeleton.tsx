"use client";

import { Header } from "@/components/header";

export function CashbookSkeleton() {
    return (
        <div className="w-full bg-background pb-28">
            <Header title="Cashbook" />

            <div className="mx-auto w-full max-w-4xl px-6 pb-32">
                {/* Summary Skeleton */}
                <div className="mt-6 rounded-3xl bg-muted/30 animate-pulse p-6 h-56 shadow-sm" />

                {/* Filters Skeleton */}
                <div className="mt-6 space-y-4">
                    <div className="h-12 w-full bg-muted/30 animate-pulse rounded-full" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-9 w-20 bg-muted/30 animate-pulse rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Transaction List Skeleton */}
                <div className="mt-6 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
