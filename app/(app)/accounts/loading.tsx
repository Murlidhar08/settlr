import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full bg-background min-h-screen">
            <div className="mx-auto w-full max-w-4xl px-6 py-8">

                <div className="space-y-16">
                    {/* Section 1 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-1">
                            <Skeleton className="h-1 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-3 w-24 rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] bg-muted/20 border-2" />
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-1">
                            <Skeleton className="h-1 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-3 w-24 rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] bg-muted/20 border-2" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
