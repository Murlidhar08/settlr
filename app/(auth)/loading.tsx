import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="space-y-4">
                    <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="mx-auto h-8 w-48" />
                        <Skeleton className="mx-auto h-4 w-64" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl mt-8" />
                </div>
            </div>
        </div>
    );
}
