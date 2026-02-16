import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { MoveDownLeft, MoveUpRight, PiggyBank } from "lucide-react"
import StatCard from "./status-card"
import { formatAmount } from "@/utility/transaction"
import { getUserConfig } from "@/lib/user-config"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"

export default async function SummaryCard() {
  const session = await getUserSession();
  const { currency } = await getUserConfig();

  let businessId = session?.user.activeBusinessId
  if (!businessId && session?.user.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    });
    businessId = business?.id;
  }

  if (!businessId) return null

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Parallel fetch: All-time stats and Today's stats using DB aggregation
  // Parallel fetch: All-time stats and Today's stats using DB aggregation
  // 1. Fetch all financial accounts for the business
  const accounts = await prisma.financialAccount.findMany({
    where: { businessId },
    select: { id: true, type: true, partyId: true }
  });

  const moneyAccIds = new Set(accounts.filter(a => a.type === FinancialAccountType.MONEY).map(a => a.id));
  const partyAccs = accounts.filter(a => a.type === FinancialAccountType.PARTY);

  // 2. Fetch all transactions (for a production app, we should use aggregation, but for now we calculate net stats)
  const transactions = await prisma.transaction.findMany({
    where: { businessId },
    select: {
      amount: true,
      fromAccountId: true,
      toAccountId: true,
      partyId: true,
      date: true
    }
  });

  let receivable = 0;
  let payable = 0;
  let todayIn = 0;
  let todayOut = 0;

  // Process Party Balances for Receivables/Payables
  const partyToAccId = new Map(partyAccs.map(a => [a.partyId!, a.id]));
  const partyBalances: Record<string, number> = {};

  transactions.forEach(tx => {
    // Today's Cash Flow logic
    if (tx.date >= startOfDay && tx.date <= endOfDay) {
      if (moneyAccIds.has(tx.toAccountId)) todayIn += Number(tx.amount);
      if (moneyAccIds.has(tx.fromAccountId)) todayOut += Number(tx.amount);
    }

    // Party Balance logic
    if (tx.partyId) {
      const pAccId = partyToAccId.get(tx.partyId);
      if (pAccId) {
        if (tx.toAccountId === pAccId) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) + Number(tx.amount);
        }
        if (tx.fromAccountId === pAccId) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) - Number(tx.amount);
        }
      }
    }
  });

  Object.values(partyBalances).forEach(balance => {
    if (balance > 0) receivable += balance;
    else if (balance < 0) payable += Math.abs(balance);
  });

  const todayNetCash = todayIn - todayOut;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Today's Cash Flow */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 group dark:bg-slate-950 p-8 text-white shadow-2xl shadow-indigo-500/10 transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 border border-white/5">
        <div className="absolute -top-20 -right-20 h-48 w-100 rounded-full bg-indigo-500/40 blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Today&apos;s Cash Flow</p>
            <p className="text-4xl font-black tracking-tighter">
              {formatAmount(todayNetCash, currency)}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <PiggyBank className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        <div className={`relative z-10 mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${todayNetCash >= 0
          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
          : "bg-rose-400/10 text-rose-400 border-rose-400/20"
          }`}
        >
          {todayNetCash >= 0 ? (
            <MoveUpRight className="h-3 w-3" />
          ) : (
            <MoveDownLeft className="h-3 w-3" />
          )}
          {todayNetCash >= 0 ? "Daily Surplus" : "Daily Deficit"}
        </div>
      </div>

      {/* Receivable */}
      <StatCard
        title="Receivables"
        amount={formatAmount(Math.abs(receivable), currency)}
        subtitle="You'll Get"
        icon={<MoveDownLeft />}
        positive
      />

      {/* Payable */}
      <StatCard
        title="Payables"
        amount={formatAmount(Math.abs(payable), currency)}
        subtitle="You'll Give"
        icon={<MoveUpRight />}
        positive={false}
      />
    </section>
  )
}
