import { BackHeader } from "@/components/back-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-30 flex items-center justify-between bg-background/60 backdrop-blur-2xl px-6 py-5 border-b border-border/40">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="w-11" />
            </div>

            <main className="mx-auto max-w-4xl px-4 pb-36 pt-12 md:px-6 space-y-12">
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>

                <Skeleton className="h-48 w-full rounded-[2.5rem]" />

                <div className="space-y-4">
                    <Skeleton className="h-72 w-full rounded-[2.5rem]" />
                </div>
            </main>
        </div>
    );
}
