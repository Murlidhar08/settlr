"use client";

// Packages
import { useState } from "react";
import { Plus } from "lucide-react";

// Components
import { Header } from "@/components/header";
import CashSummary from "./components/CashSummary";
import CashFilters from "./components/CashFilters";
import CashTransactionItem from "./components/CashTransactionItem";
import AddTransactionSheet from "./components/AddTransactionSheet";

export default function CashbookPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-background pb-28">
      <Header title="Cashbook" />

      {/* Container */}
      <div className="mx-auto w-full max-w-4xl px-6 pb-32">
        <CashSummary />

        {/* Filters */}
        <CashFilters />

        {/* Transactions */}
        <div>
          <section>
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3">
              <span>Today, 12 Oct</span>
              <span>-₹330.00</span>
            </div>

            <div className="space-y-3">

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
            </div>
          </section>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Transaction Sheet */}
      <AddTransactionSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}
