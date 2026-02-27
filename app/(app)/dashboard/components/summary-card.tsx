import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { MoveDownLeft, MoveUpRight, PiggyBank } from "lucide-react"
import StatCard from "./status-card"
import { formatAmount } from "@/utility/transaction"
import { getUserConfig } from "@/lib/user-config"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"
import { getTransactionPerspective } from "@/lib/transaction-logic"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { t } from "@/lib/languages/i18n"
import { cn } from "@/lib/utils"

export default async function SummaryCard() {
  const session = await getUserSession();
  const { currency, language } = await getUserConfig();

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
  let liquidCash = 0;

  // Process Party Balances for Receivables/Payables
  const partyToAccId = new Map(partyAccs.map(a => [a.partyId!, a.id]));
  const partyBalances: Record<string, number> = {};
  const moneyBalances: Record<string, number> = {};

  transactions.forEach(tx => {
    const amount = Number(tx.amount);

    // Today's Cash Flow logic (relative to all money accounts)
    if (tx.date >= startOfDay && tx.date <= endOfDay) {
      if (moneyAccIds.has(tx.toAccountId)) todayIn += amount;
      if (moneyAccIds.has(tx.fromAccountId)) todayOut += amount;
    }

    // Money Account Balances
    if (moneyAccIds.has(tx.toAccountId)) {
      moneyBalances[tx.toAccountId] = (moneyBalances[tx.toAccountId] || 0) + amount;
    }
    if (moneyAccIds.has(tx.fromAccountId)) {
      moneyBalances[tx.fromAccountId] = (moneyBalances[tx.fromAccountId] || 0) - amount;
    }

    // Party Balance logic
    if (tx.partyId) {
      const pAccId = partyToAccId.get(tx.partyId);
      if (pAccId) {
        const perspective = getTransactionPerspective(tx.toAccountId, tx.fromAccountId, pAccId);
        if (perspective === TransactionDirection.IN) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) + amount;
        } else if (perspective === TransactionDirection.OUT) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) - amount;
        }
      }
    }
  });

  Object.values(partyBalances).forEach(balance => {
    if (balance > 0) receivable += balance;
    else if (balance < 0) payable += Math.abs(balance);
  });

  Object.values(moneyBalances).forEach(bal => {
    liquidCash += bal;
  })

  const todayNetCash = todayIn - todayOut;
  const netWorth = liquidCash + receivable - payable;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Liquid Cash - Premium Card */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-500/90 group p-5 sm:p-8 text-white shadow-2xl shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:shadow-indigo-500/30 border border-white/10 backdrop-blur-md">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/20 blur-3xl group-hover:bg-white/30 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl transition-all duration-700" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Total Cash</p>
            <p className="text-2xl font-black tracking-tighter sm:text-4xl">
              {formatAmount(liquidCash, currency)}
            </p>
          </div>
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <PiggyBank className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mr-2">Net Worth</span>
            <span className="text-xs font-black text-white">{formatAmount(netWorth, currency)}</span>
          </div>
        </div>
      </div>

      {/* Today's Cash Flow */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-900 group dark:bg-slate-950 p-5 sm:p-8 text-white shadow-2xl shadow-indigo-500/10 transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 border border-white/5">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{t("dashboard.cash_flow", language)}</p>
            <p className="text-2xl font-black tracking-tighter sm:text-4xl">
              {formatAmount(todayNetCash, currency)}
            </p>
          </div>
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-all duration-500">
            <div className={cn(
              "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
              todayNetCash >= 0
                ? "bg-emerald-400 shadow-emerald-400/50 animate-pulse"
                : "bg-rose-400 shadow-rose-400/50 animate-pulse"
            )} />
          </div>
        </div>

        <div className={`relative z-10 mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border transition-all ${todayNetCash >= 0
          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 group-hover:bg-emerald-400/20"
          : "bg-rose-400/10 text-rose-400 border-rose-400/20 group-hover:bg-rose-400/20"
          }`}
        >
          {todayNetCash >= 0 ? (
            <MoveUpRight className="h-3 w-3" />
          ) : (
            <MoveDownLeft className="h-3 w-3" />
          )}
          {todayNetCash >= 0 ? t("dashboard.surplus", language) : t("dashboard.deficit", language)}
        </div>
      </div>

      {/* Receivable */}
      <StatCard
        title={t("dashboard.receivables", language)}
        amount={formatAmount(Math.abs(receivable), currency)}
        subtitle={t("dashboard.you_get", language)}
        icon={<MoveDownLeft />}
        positive
      />

      {/* Payable */}
      <StatCard
        title={t("dashboard.payables", language)}
        amount={formatAmount(Math.abs(payable), currency)}
        subtitle={t("dashboard.you_give", language)}
        icon={<MoveUpRight />}
        positive={false}
      />
    </section>
  )
}
