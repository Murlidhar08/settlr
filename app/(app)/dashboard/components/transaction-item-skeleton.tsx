export function TransactionItemSkeleton() {
  return (
    <div className="block">
      <div className="flex items-center gap-4 p-4 rounded-[1.5rem] border bg-card/40 backdrop-blur-sm shadow-xs">
        {/* Icon skeleton */}
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-muted/60" />

        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />

          {/* Subtitle / Path */}
          <div className="h-3 w-1/2 animate-pulse rounded-lg bg-muted/50" />
        </div>

        {/* Amount */}
        <div className="h-5 w-20 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export function TransactionListSkeletons() {
  return (
    <div className="space-y-3">
      <TransactionItemSkeleton />
      <TransactionItemSkeleton />
      <TransactionItemSkeleton />
      <TransactionItemSkeleton />
      <TransactionItemSkeleton />
    </div>
  )
}

export default TransactionListSkeletons;
