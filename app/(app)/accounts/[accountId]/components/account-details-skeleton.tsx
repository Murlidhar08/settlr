import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function AccountDetailsSkeleton() {
    return (
        <div className="w-full bg-background relative pb-32">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                 <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                 </div>
            </div>

            <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 space-y-12">
                {/* Hero Stats Card Skeleton */}
                <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl border-2 border-muted bg-muted/10 animate-pulse">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-12 w-64" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:w-1/3">
                            <Skeleton className="h-24 rounded-2xl" />
                            <Skeleton className="h-24 rounded-2xl" />
                        </div>
                    </div>
                </div>

                {/* Transaction List Skeleton */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-1 w-12" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                    </div>

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
                </div>
            </main>
        </div>
    );
}
