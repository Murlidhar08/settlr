import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCardSkeleton } from "./components/summary-card";
import { TransactionListSkeletons } from "./components/transaction-item-skeleton";
import { BudgetAlertsSkeleton } from "./components/budget-alerts";

export default function DashboardLoading() {
  return (
    <div className="flex-1 px-4 space-y-6 sm:space-y-8 pb-34">
      {/* Header Section Skeleton */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-3">
          {/* Welcome Text Skeleton */}
          <div className="h-10 w-64 bg-muted/60 animate-pulse rounded-2xl" />
          {/* Subtitle Skeleton */}
          <div className="h-4 w-48 bg-muted/40 animate-pulse rounded-lg" />
        </div>
        <div className="shrink-0 flex items-center h-12 w-32 bg-muted/40 animate-pulse rounded-2xl" />
      </section>

      {/* Global Stats Grid Skeleton */}
      <SummaryCardSkeleton />

      {/* Visual Analytics Row Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Skeleton className="h-[450px] w-full rounded-[2.5rem] bg-muted/20 animate-pulse border-2 border-dashed border-muted/30" />
        <Skeleton className="h-[450px] w-full rounded-[2.5rem] bg-muted/20 animate-pulse border-2 border-dashed border-muted/30" />
      </div>

      {/* Recent Activity Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
        <section className="lg:col-span-2 space-y-6">
          <div className="h-4 w-32 bg-muted/40 animate-pulse rounded-lg mb-4" />
          <TransactionListSkeletons />
        </section>

        {/* Quick Stats / Mini Cards Column */}
        <aside className="space-y-6">
          <div className="h-4 w-24 bg-muted/40 animate-pulse rounded-lg mb-4" />
          <BudgetAlertsSkeleton />
        </aside>
      </div>
    </div>
  );
}
