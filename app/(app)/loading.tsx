import { Skeleton } from "@/components/ui/skeleton";

export default function GenericLoading() {
  return (
    <div className="flex-1 px-6 py-8 space-y-12">
      {/* Page Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 bg-muted/60 animate-pulse rounded-2xl" />
        <Skeleton className="h-4 w-64 bg-muted/40 animate-pulse rounded-lg" />
      </div>

      {/* Content Skeleton - Generic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full rounded-[2.5rem] bg-muted/20 animate-pulse border-2 border-dashed border-muted/30" />
        <Skeleton className="h-48 w-full rounded-[2.5rem] bg-muted/20 animate-pulse border-2 border-dashed border-muted/30" />
        <Skeleton className="h-48 w-full rounded-[2.5rem] bg-muted/20 animate-pulse border-2 border-dashed border-muted/30" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl bg-muted/10 animate-pulse" />
        <Skeleton className="h-16 w-full rounded-2xl bg-muted/10 animate-pulse" />
        <Skeleton className="h-16 w-full rounded-2xl bg-muted/10 animate-pulse" />
        <Skeleton className="h-16 w-full rounded-2xl bg-muted/10 animate-pulse" />
      </div>
    </div>
  );
}
