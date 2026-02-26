// Component
import SummaryCard from "./components/summary-card";
import SwitchBusiness from "./components/business-switch";

// Actions
import RecentTransaction from "./components/recent-transaction";
import { Suspense } from "react";
import { StatusGridSkeletons } from "./components/status-card-loading";
import { TransactionListSkeletons } from "./components/transaction-item-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { t } from "@/lib/languages/i18n";
import { CashflowChart } from "./components/cashflow-chart";
import { AccountsDistribution } from "./components/accounts-distribution";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const { language } = await getUserConfig();

  return (
    <div className="w-full">

      <div className="px-4">
        <div className="my-4">
          <SwitchBusiness />
        </div>

        <Suspense fallback={<StatusGridSkeletons />}>
          <SummaryCard />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={<Skeleton className="mt-8 h-[400px] w-full rounded-[2.5rem] bg-muted/40 animate-pulse" />}>
            <CashflowChart />
          </Suspense>

          <Suspense fallback={<Skeleton className="mt-8 h-[400px] w-full rounded-[2.5rem] bg-muted/40 animate-pulse" />}>
            <AccountsDistribution />
          </Suspense>
        </div>

        <section className="flex-1 pt-6 md:px-6">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t("dashboard.recent_transactions", language)}</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-all hover:tracking-[0.2em]">
              {t("dashboard.view_all", language)}
            </button>
          </div>

          <Suspense fallback={<TransactionListSkeletons />}>
            <RecentTransaction />
          </Suspense>
        </section>

        <div className="h-24" />
      </div>
    </div>
  );
}
