function StatusCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-[2.5rem] border p-8 shadow-sm bg-muted/40 border-border animate-pulse">
      <div className="space-y-6 flex-1">
        {/* title */}
        <div className="h-3 w-24 rounded bg-muted" />

        {/* amount */}
        <div className="h-8 w-40 rounded bg-muted" />

        {/* subtitle */}
        <div className="h-3 w-28 rounded bg-muted" />
      </div>

      {/* icon placeholder */}
      <div className="h-14 w-14 rounded-2xl bg-muted border-2 border-muted-foreground/10" />
    </div>
  );
}

export function StatusGridSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatusCardSkeleton />
      <StatusCardSkeleton />
      <StatusCardSkeleton />
      <StatusCardSkeleton />
    </div>
  )
}
