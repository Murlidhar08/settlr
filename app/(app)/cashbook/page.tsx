// Components
import { Header } from "@/components/header";
import CashSummary from "./components/CashSummary";
import CashFilters from "./components/CashFilters";
import { TransactionList } from "@/components/transaction/transaction-list";
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal";

// Lib
import { TransactionDirection } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function CashbookPage() {
  const session = await getUserSession();
  const rawPartyDetails = await prisma.transaction.findMany({
    where: {
      businessId: session?.session.activeBusinessId || "",
      partyId: null,
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
    ],
  });

  const updtlList = rawPartyDetails?.map((tra) => {
    return {
      ...tra,
      amount: Number(tra.amount)
    }
  }) ?? []

  let totalIn = 0,
    totalOut = 0;

  rawPartyDetails?.forEach((tra) => {
    if (tra.direction == TransactionDirection.IN)
      totalIn += Number(tra.amount);
    else if (tra.direction == TransactionDirection.OUT) {
      totalOut += Number(tra.amount);
    }
  })

  return (
    <div className="w-full bg-background pb-28">
      <Header title="Cashbook" />

      {/* Container */}
      <div className="mx-auto w-full max-w-4xl px-6 pb-32">
        <CashSummary totalIn={totalIn} totalOut={totalOut} />

        {/* Filters */}
        <CashFilters />

        {/* Transactions */}
        <div className="mt-3">
          <section>
            {/* Transaction List */}
            <TransactionList partyId={null} transactions={updtlList || []} />
          </section>
        </div>
      </div>

      <FooterButtons>
        {/* YOU GAVE */}
        <AddTransactionModal
          title="Add Transaction"
          direction={TransactionDirection.OUT}
        >
          <Button size="lg" className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            <ArrowUpRight className="h-5 w-5" />
            You Gave
          </Button>
        </AddTransactionModal>

        {/* YOU GET */}
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
