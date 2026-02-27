import { Suspense } from "react";
import { getUserSession } from "@/lib/auth";
import { getUserConfig } from "@/lib/user-config";
import { t } from "@/lib/languages/i18n";

// Components
import SummaryCard from "./components/summary-card";
import { CashflowChart } from "./components/cashflow-chart";
import { AccountsDistribution } from "./components/accounts-distribution";
import RecentTransaction from "./components/recent-transaction";
import SwitchBusiness from "./components/business-switch";
import { StatusGridSkeletons } from "./components/status-card-loading";
import { TransactionListSkeletons } from "./components/transaction-item-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetAlerts } from "./components/budget-alerts";

export default async function Page() {
  const session = await getUserSession();
  const { language } = await getUserConfig();

  const firstName = session?.user.name?.split(" ")[0] || "User";

  return (
    <div className="flex-1 px-4 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tighter sm:text-4xl text-foreground">
            Hello, <span className="text-primary">{firstName}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground/60">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="shrink-0">
          <SwitchBusiness />
        </div>
      </section>

      {/* Global Stats Grid */}
      <Suspense fallback={<StatusGridSkeletons />}>
        <SummaryCard />
      </Suspense>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-[2.5rem] bg-muted/40 animate-pulse border-2 border-dashed border-muted" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Performance Trend</h2>
              <div className="h-1 flex-1 mx-4 bg-linear-to-r from-muted to-transparent rounded-full" />
            </div>
            <CashflowChart />
          </div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-[2.5rem] bg-muted/40 animate-pulse border-2 border-dashed border-muted" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Liquidity Distribution</h2>
              <div className="h-1 flex-1 mx-4 bg-linear-to-r from-muted to-transparent rounded-full" />
            </div>
            <AccountsDistribution />
          </div>
        </Suspense>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
        <section className="lg:col-span-2 space-y-6">
          <div className="px-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t("dashboard.recent_transactions", language)}</h2>
          </div>

          <Suspense fallback={<TransactionListSkeletons />}>
            <div className="relative">
              <div className="absolute -top-10 left-10 h-40 w-40 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
              <RecentTransaction />
            </div>
          </Suspense>
        </section>

        {/* Quick Stats / Mini Cards Column */}
        <aside className="space-y-6">
          <div className="px-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Insights</h2>
          </div>
          <BudgetAlerts />
        </aside>
      </div>
    </div>
  );
}
