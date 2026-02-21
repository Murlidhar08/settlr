// Component
import SummaryCard from "./components/summary-card";
import { Header } from "@/components/header";
import SwitchBusiness from "./components/business-switch";

// Actions
import RecentTransaction from "./components/recent-transaction";
import { Suspense } from "react";
import { StatusGridSkeletons } from "./components/status-card-loading";
import { TransactionListSkeletons } from "./components/transaction-item-skeleton";
import { getUserConfig } from "@/lib/user-config";
import { t } from "@/lib/languages/i18n";

export default async function Page() {
  const { language } = await getUserConfig();

  return (
    <div className="w-full">
      <Header title={t("dashboard.title", language)} />

      <div className="px-4">
        <div className="my-4">
          <SwitchBusiness />
        </div>

        <Suspense fallback={<StatusGridSkeletons />}>
          <SummaryCard />
        </Suspense>

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
