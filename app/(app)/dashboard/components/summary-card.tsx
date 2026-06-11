"use client";

import { CountUp } from "@/components/ui/count-up";
import { tran } from "@/lib/languages/i18n";
import { cn } from "@/lib/utils";
import { useDashboardSummary } from "@/tanstacks/dashboard";
import { MoveDownLeft, MoveUpRight, PiggyBank } from "lucide-react";
import { StatusCard } from "./status-card";

export default function SummaryCard() {
  const { data, isPending } = useDashboardSummary();

  const liquidCash = data?.liquidCash || 0;
  const todayNetCash = data?.todayNetCash || 0;
  const receivable = data?.receivable || 0;
  const payable = data?.payable || 0;
  const netWorth = data?.netWorth || 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Liquid Cash - Premium Card */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-500/90 group p-5 sm:p-8 text-white shadow-2xl shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:shadow-indigo-500/30 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/20 blur-3xl group-hover:bg-white/30 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl transition-all duration-700" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{tran("dashboard.total_balance")}</p>
            <p className="text-2xl font-black tracking-tighter sm:text-4xl leading-none">
              <CountUp value={liquidCash} isLoading={isPending} />
            </p>
          </div>
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <PiggyBank className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mr-2">{tran("dashboard.net_worth")}</span>
            <span className="text-xs font-black text-white leading-none">
              <CountUp value={netWorth} isLoading={isPending} />
            </span>
          </div>
        </div>
      </div>

      {/* Today's Cash Flow */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-900 group dark:bg-slate-950 p-5 sm:p-8 text-white shadow-2xl shadow-indigo-500/10 transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{tran("dashboard.cash_flow")}</p>
            <p className="text-2xl font-black tracking-tighter sm:text-4xl text-white leading-none">
              <CountUp value={todayNetCash} isLoading={isPending} />
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

        <div className={cn(
          "relative z-10 mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border transition-all",
          todayNetCash >= 0
            ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 group-hover:bg-emerald-400/20"
            : "bg-rose-400/10 text-rose-400 border-rose-400/20 group-hover:bg-rose-400/20"
        )}
        >
          {todayNetCash >= 0 ? (
            <MoveUpRight className="h-3 w-3" />
          ) : (
            <MoveDownLeft className="h-3 w-3" />
          )}
          {todayNetCash >= 0 ? tran("dashboard.surplus") : tran("dashboard.deficit")}
        </div>
      </div>

      {/* Receivable */}
      <StatusCard
        title={tran("dashboard.receivables")}
        amount={<CountUp value={Math.abs(receivable)} isLoading={isPending} />}
        subtitle={tran("dashboard.you_get")}
        icon={<MoveDownLeft />}
        positive
        delayClass="delay-200"
      />

      {/* Payable */}
      <StatusCard
        title={tran("dashboard.payables")}
        amount={<CountUp value={Math.abs(payable)} isLoading={isPending} />}
        subtitle={tran("dashboard.you_give")}
        icon={<MoveUpRight />}
        positive={false}
        delayClass="delay-300"
      />
    </section>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-3xl sm:rounded-[2.5rem] border p-8 shadow-sm bg-muted/40 border-border animate-pulse">
          <div className="space-y-6 flex-1">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-8 w-40 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-muted border-2 border-muted-foreground/10" />
        </div>
      ))}
    </div>
  )
}
