"use client"
 
import { getCashbookTransactions } from "@/actions/transaction.actions"
import { Currency } from "@/lib/generated/prisma/enums"
import { useState, useEffect } from "react"
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
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await getCashbookTransactions({ search, category, startDate, endDate })
        if (isMounted) setData(res)
      } catch (error) {
        console.error("Failed to fetch cashbook transactions:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false; };
  }, [search, category, startDate, endDate])
 
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
