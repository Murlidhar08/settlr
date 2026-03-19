import { Suspense } from "react";
import CashFilters from "./components/cash-filters";
import { CashbookSkeleton } from "./components/cashbook-skeleton";
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal";
import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { TransactionDirection } from "@/types/transaction/TransactionDirection";
import { t } from "@/lib/languages/i18n";
import { getUserConfig, getDefaultConfig } from "@/lib/user-config";
import { CashbookContent } from "./components/cashbook-content";

interface CashbookPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function CashbookPage({ searchParams }: CashbookPageProps) {
  const params = await searchParams;
  let userConfig = await getUserConfig();
  userConfig = userConfig ?? getDefaultConfig();

  const today = format(new Date(), "yyyy-MM-dd");

  const hasOtherFilters = params.search || params.category;
  const effectiveStartDate = params.startDate || (!hasOtherFilters ? today : undefined);
  const effectiveEndDate = params.endDate || (!hasOtherFilters ? today : undefined);

  return (
    <div className="w-full flex-1 bg-background">
      <div className="mx-auto w-full max-w-4xl pb-32 px-6">
        <CashFilters effectiveStartDate={effectiveStartDate} effectiveEndDate={effectiveEndDate} />

        <Suspense
          key={`${params.search}-${params.category}-${effectiveStartDate}-${effectiveEndDate}`}
          fallback={<CashbookSkeleton />}
        >
          <CashbookContent
            search={params.search}
            category={params.category}
            startDate={effectiveStartDate}
            endDate={effectiveEndDate}
            currency={userConfig.currency}
          />
        </Suspense>
      </div>

      <FooterButtons>
        <AddTransactionModal
          title="New Entry"
          direction={TransactionDirection.OUT}
          path="/cashbook"
        >
          <Button className="h-14 w-full md:w-auto md:px-24 rounded-full gap-3 font-semibold uppercase bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 py-2">
            <span className="text-center font-black tracking-[0.2em] text-sm">
              Add Entry
            </span>
          </Button>
        </AddTransactionModal>
      </FooterButtons>
    </div>
  );
}



