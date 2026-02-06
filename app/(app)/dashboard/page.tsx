// Component
import SummaryCard from "./components/summary-card";
import { Header } from "@/components/header";
import SwitchBusiness from "./components/business-switch";

// Actions
import RecentTransaction from "./components/recent-transaction";
import { Suspense } from "react";
import { StatusGridSkeletons } from "./components/status-card-loading";
import { TransactionListSkeletons } from "./components/transaction-item-skeleton";

/* ========================================================= */
/* PAGE */
/* ========================================================= */
export default function Page() {
  // const { currency } = await getUserConfig();

  // TEMP changes
  // new Promise((resolve, reject) => {
  //   setTimeout(resolve, 3000)
  // });

  // const selectedBusinessId = session.session?.activeBusinessId || businessList?.[0]?.id;
  // await switchBusiness(selectedBusinessId);



  return (
    <div className="w-full">
      {/* Header */}
      <Header title="Dashboard" />

      {/* Store */}
      <div className="px-4">
        <div className="mb-4">
          <SwitchBusiness />
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<StatusGridSkeletons />}>
          <SummaryCard />
        </Suspense>


        {/* Transactions */}
        <section className="flex-1 pt-6 md:px-6">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="text-sm text-slate-500 hover:text-[#2C3E50] transition">
              View All
            </button>
          </div>

          <Suspense fallback={<TransactionListSkeletons />}>
            <RecentTransaction />
          </Suspense>
        </section>

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>
    </div>
  );
}
