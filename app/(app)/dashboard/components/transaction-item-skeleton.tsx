export function TransactionItemSkeleton() {
  return (
    <div className="block">
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          {/* Icon skeleton */}
          <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-2">
            {/* Meta */}
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

            {/* Title */}
            <div className="h-4 w-40 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>

        {/* Amount */}
        <div className="h-4 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
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
