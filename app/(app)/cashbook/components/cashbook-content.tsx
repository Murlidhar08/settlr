"use client"

import { Currency } from "@/lib/generated/prisma/enums"
import { useCashbook } from "@/tanstacks/cashbook"
import CashSummary from "./cash-summary"
import { CashbookList } from "./cashbook-list"

interface CashbookContentProps {
  search?: string
  category?: string
  startDate?: string
  endDate?: string
  currency: Currency
}

export function CashbookContent({
  search,
  category,
  startDate,
  endDate,
  currency
}: CashbookContentProps) {

  const { data, isLoading } = useCashbook({ search, category, startDate, endDate });

  const transactions = data?.transactions ?? []
  const totalIn = data?.totalIn ?? 0
  const totalOut = data?.totalOut ?? 0

  return (
    <div className="mt-8 space-y-8">
      <CashSummary totalIn={totalIn} totalOut={totalOut} currency={currency} isLoading={isLoading} />

      <div>
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Transactions
        </p>

        <CashbookList transactions={transactions} isLoading={isLoading} />
      </div>
    </div>
  )
}
