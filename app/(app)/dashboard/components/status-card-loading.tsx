function StatusCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-5 shadow-sm bg-muted/40 border-border animate-pulse">
      <div className="space-y-6">
        {/* title */}
        <div className="h-4 w-24 rounded bg-muted" />

        {/* amount */}
        <div className="h-6 w-32 rounded bg-muted" />

        {/* subtitle */}
        <div className="h-3 w-20 rounded bg-muted" />
      </div>

      {/* icon placeholder */}
      <div className="h-12 w-12 rounded-full bg-muted border-2 border-muted-foreground/10" />
    </div>
  );
}

export function StatusGridSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatusCardSkeleton />
      <StatusCardSkeleton />
      <StatusCardSkeleton />
    </div>
  )
}
