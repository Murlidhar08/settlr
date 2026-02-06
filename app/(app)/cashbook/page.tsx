import { Suspense } from "react";
import { Header } from "@/components/header";
import CashSummary from "./components/cash-summary";
import CashFilters from "./components/cash-filters";
import { CashbookList } from "./components/cashbook-list";
import { CashbookSkeleton } from "./components/cashbook-skeleton";
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal";
import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransactionDirection } from "@/lib/generated/prisma/enums";
import { getCashbookTransactions } from "@/actions/transaction.actions";
import { format } from "date-fns";

interface CashbookPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    date?: string;
  }>;
}

export default async function CashbookPage({ searchParams }: CashbookPageProps) {
  const params = await searchParams;

  // Default to today's date if no date is provided and no search/category is active
  // Or maybe always default to today if date is explicitly missing?
  // Let's follow "Default to Current date" strictly.
  const effectiveDate = params.date || (!params.search && !params.category ? format(new Date(), "yyyy-MM-dd") : undefined);

  return (
    <div className="w-full bg-background min-h-screen">
      <Suspense fallback={<CashbookSkeleton />}>
        <CashbookContent
          search={params.search}
          category={params.category}
          date={effectiveDate}
        />
      </Suspense>
    </div>
  );
}

async function CashbookContent({ search, category, date }: { search?: string; category?: string; date?: string }) {
  const { transactions, totalIn, totalOut } = await getCashbookTransactions({
    search,
    category,
    date,
  });

  const transactionsPromise = Promise.resolve(transactions);

  return (
    <div className="w-full bg-background pb-28">
      <Header title="Cashbook" />

      <div className="mx-auto w-full max-w-4xl px-6 pb-32">
        <CashSummary totalIn={totalIn} totalOut={totalOut} />

        <CashFilters />

        <div className="mt-6">
          <Suspense fallback={<div className="h-40 w-full animate-pulse bg-muted/20 rounded-2xl" />}>
            <CashbookList promise={transactionsPromise} />
          </Suspense>
        </div>
      </div>

      <FooterButtons>
        <AddTransactionModal
          title="Add Transaction"
          direction={TransactionDirection.OUT}
          path="/cashbook"
        >
          <Button size="lg" className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            <ArrowUpRight className="h-5 w-5" />
            You Gave
          </Button>
        </AddTransactionModal>

        <AddTransactionModal
          title="Add Transaction"
          direction={TransactionDirection.IN}
          path="/cashbook"
        >
          <Button
            size="lg"
            className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowDownLeft className="h-5 w-5" />
            You Get
          </Button>
        </AddTransactionModal>
      </FooterButtons>
    </div>
  );
}

