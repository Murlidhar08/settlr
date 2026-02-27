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
    <div className="w-full bg-background min-h-screen">
      <div className="mx-auto w-full max-w-4xl pb-32">
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
          title={t("cashbook.add_transaction", userConfig.language)}
          direction={TransactionDirection.OUT}
          path="/cashbook"
        >
          <Button className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
            <ArrowUpRight className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="hidden md:block text-center">
              {t("cashbook.you_pay", userConfig.language)}
            </span>
          </Button>
        </AddTransactionModal>

        <AddTransactionModal
          title={t("cashbook.add_transaction", userConfig.language)}
          direction={TransactionDirection.IN}
          path="/cashbook"
        >
          <Button
            className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2"
          >
            <ArrowDownLeft className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="hidden md:block text-center">
              {t("cashbook.you_receive", userConfig.language)}
            </span>
          </Button>
        </AddTransactionModal>
      </FooterButtons>
    </div>
  );
}



