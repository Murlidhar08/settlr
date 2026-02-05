// Component
import SummaryCard from "./components/summary-card";
import { Header } from "@/components/header";
import SwitchBusiness from "./components/business-switch";

// Actions
import RecentTransaction from "./components/recent-transaction";
import { Suspense } from "react";
import { StatGridSkeletons } from "./components/stat-card-loading";

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
          <SwitchBusiness
          // businesses={businessList}
          // activeBusinessId={selectedBusinessId}
          />
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<StatGridSkeletons />}>
          <SummaryCard />
        </Suspense>


        {/* Transactions */}
        <Suspense fallback={"Loading Recent transaction..."}>
          <RecentTransaction />
        </Suspense>
      </div>
    </div>
  );
}
