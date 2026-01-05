// Packages
import { Plus } from "lucide-react";

// Components
import { Header } from "@/components/header";
import CashSummary from "./components/CashSummary";
import CashFilters from "./components/CashFilters";
import CashTransactionItem from "./components/CashTransactionItem";
import { TransactionItem } from "@/components/transaction-item";
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums";
import { AddTransactionSheet } from "./components/AddTransactionSheet";
import { TransactionList } from "../parties/[partyId]/components/transaction-list";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { AddTransactionFooter } from "../parties/[partyId]/components/add-transaction-footer";

export default async function CashbookPage() {
  const session = await getUserSession();
  const rawPartyDetails = await prisma.transaction.findMany({
    select: {
      id: true,
      amount: true,
      date: true,
      mode: true,
      direction: true,
      description: true,
      createdAt: true
    },
    where: {
      businessId: session?.session.activeBusinessId || "",
      partyId: null,
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
    ],
  });

  const updtlList = rawPartyDetails ?? []

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
            {/* <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3">
              <span>Today, 12 Oct</span>
              <span>-₹330.00</span>
            </div> */}

            {/* Transaction List */}
            <TransactionList partyId={null} transactions={updtlList || []} />

            {/* <div className="space-y-3">
              <TransactionItem
                amount="300"
                mode={PaymentMode.CASH}
                subtitle="Test"
                title="Mahesh Chavda"
                type={TransactionDirection.IN}
              />

              <CashTransactionItem
                name="Sarah Mitchell"
                time="10:42 AM"
                amount="+₹120.00"
                type="in"
                tag="Online"
              />

              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
              <CashTransactionItem
                name="Fast Logistics"
                time="02:15 PM"
                amount="-₹450.00"
                type="out"
                tag="Cash"
              />
            </div> */}
          </section>
        </div>
      </div>

      {/* Floating Action Button */}
      {/* <AddTransactionSheet
        title="Add Cash"
        direction={TransactionDirection.IN}
      >
        <button className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </button>
      </AddTransactionSheet> */}

      <AddTransactionFooter partyId={null} />

      {/* Add Transaction Sheet */}
      {/* <AddTransactionSheet open={open} onOpenChange={setOpen} /> */}
    </div>
  );
}
