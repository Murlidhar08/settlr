import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDirection, PaymentMode } from "@/lib/generated/prisma/enums"
import { MoveDownLeft, MoveUpRight, PiggyBank } from "lucide-react"
import StatCard from "./stat-card"
import { formatAmount } from "@/utility/transaction"
import { getUserConfig } from "@/lib/user-config"

export default async function SummaryCard() {
  const session = await getUserSession();
  const { currency } = await getUserConfig();

  const businessId = session?.session.activeBusinessId
  if (!businessId) return null

  const transactions = await prisma.transaction.findMany({
    where: { businessId },
    select: {
      amount: true,
      direction: true,
      mode: true,
    },
  })

  let cashIn = 0
  let cashOut = 0
  let receivable = 0
  let payable = 0

  transactions.forEach((tx) => {
    const amount = tx.amount.toNumber()

    // CASH
    if (tx.mode === PaymentMode.CASH) {
      if (tx.direction === TransactionDirection.IN)
        cashIn += amount
      else
        cashOut += amount
    }

    // CREDIT (ONLINE / BANK)
    if (tx.mode !== PaymentMode.CASH) {
      if (tx.direction === TransactionDirection.IN)
        receivable += amount
      else
        payable += amount
    }
  })

  const netCash = cashIn - cashOut

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Net Cash */}
      <div className="relative overflow-hidden rounded-3xl bg-[#2C3E50] p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex justify-between">
          <div>
            <p className="text-sm text-slate-300">Net Cash on Hand</p>
            <p className="mt-1 text-3xl font-bold">
              {formatAmount(netCash, currency)}
            </p>
          </div>
          <PiggyBank className="h-6 w-6 opacity-80" />
        </div>

        <div
          className={`relative z-10 mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${netCash >= 0
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-rose-500/20 text-rose-300"
            }`}
        >
          {netCash >= 0 ? (
            <MoveUpRight className="h-3 w-3" />
          ) : (
            <MoveDownLeft className="h-3 w-3" />
          )}
          {netCash >= 0 ? "Positive balance" : "Cash deficit"}
        </div>
      </div>

      {/* Receivable */}
      <StatCard
        title="Total Receivables"
        amount={formatAmount(receivable, currency)}
        subtitle="Customers owe you"
        icon={<MoveDownLeft />}
        positive
      />

      {/* Payable */}
      <StatCard
        title="Total Payables"
        amount={formatAmount(payable, currency)}
        subtitle="You owe suppliers"
        icon={<MoveUpRight />}
        positive={false}
      />
    </section>
  )
}
