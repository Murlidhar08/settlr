import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDirection, PaymentMode } from "@/lib/generated/prisma/enums"
import { MoveDownLeft, MoveUpRight, PiggyBank } from "lucide-react"
import StatCard from "./status-card"
import { formatAmount } from "@/utility/transaction"
import { getUserConfig } from "@/lib/user-config"

export default async function SummaryCard() {
  const session = await getUserSession();
  const { currency } = await getUserConfig();

  let businessId = session?.session.activeBusinessId
  if (!businessId && session?.user.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    });
    businessId = business?.id;
  }

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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 group dark:bg-slate-950 p-8 text-white shadow-2xl shadow-indigo-500/10 transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 border border-white/5">
        <div className="absolute -top-20 -right-20 h-48 w-100 rounded-full bg-indigo-500/40 blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Current Liquidity</p>
            <p className="text-4xl font-black tracking-tighter">
              {formatAmount(netCash, currency)}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <PiggyBank className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        <div className={`relative z-10 mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${netCash >= 0
          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
          : "bg-rose-400/10 text-rose-400 border-rose-400/20"
          }`}
        >
          {netCash >= 0 ? (
            <MoveUpRight className="h-3 w-3" />
          ) : (
            <MoveDownLeft className="h-3 w-3" />
          )}
          {netCash >= 0 ? "Account Surplus" : "Account Deficit"}
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
