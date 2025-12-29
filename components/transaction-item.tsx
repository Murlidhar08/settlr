"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface TransactionProp {
  transactionId: string,
  title: string,
  subtitle: string,
  amount: string,
  mode: PaymentMode
  type: TransactionDirection
}

const TransactionItem = ({
  transactionId,
  title,
  subtitle,
  amount,
  type,
  mode,
}: TransactionProp) => {
  const isIn = type === TransactionDirection.IN

  return (
    <Link href={`/transactions/${transactionId}`} className="block p-1">
      <Card className="flex cursor-pointer flex-row items-center gap-3 p-3 transition hover:scale-[1.01]">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${isIn ? "bg-emerald-100" : "bg-rose-100"
            }`}
        >
          {isIn ? (
            <ArrowDownLeft className="text-emerald-600" />
          ) : (
            <ArrowUpRight className="text-rose-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold lg:text-base">
            {title || (isIn ? "Payment Received" : "Payment Sent")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
            {mode} • {subtitle}
          </p>
        </div>

        <div className="shrink-0 text-right mr-3">
          <p
            className={`text-base font-bold lg:text-lg ${isIn ? "text-emerald-600" : "text-rose-600"
              }`}
          >
            {`${isIn ? "+" : "-"}₹${amount}`}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export { TransactionItem }
