"use client"

import { useQuery } from "@tanstack/react-query"
import { getCashbookTransactions } from "@/actions/transaction.actions"
import CashSummary from "./cash-summary"
import { CashbookList } from "./cashbook-list"
import { Currency } from "@/lib/generated/prisma/enums"

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
  const { data } = useQuery({
    queryKey: ["transactions", { search, category, startDate, endDate }],
    queryFn: () => getCashbookTransactions({ search, category, startDate, endDate }),
  })

  const transactions = data?.transactions ?? []
  const totalIn = data?.totalIn ?? 0
  const totalOut = data?.totalOut ?? 0

  return (
    <div className="mt-8 space-y-8">
      <CashSummary totalIn={totalIn} totalOut={totalOut} currency={currency} />

      <div>
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Transactions
        </p>
        <CashbookList transactions={transactions} />
      </div>
    </div>
  )
}
