"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";

interface BalanceCardProps {
  totalIn: number;
  totalOut: number;
  currency?: string;
}

const formatAmount = (amount: number) =>
  amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function BalanceCard({
  totalIn,
  totalOut,
  currency = "₹",
}: BalanceCardProps) {
  const netBalance = totalIn - totalOut;

  const isReceive = netBalance > 0;
  const isPay = netBalance < 0;

  const label = isReceive
    ? "Net Balance to Receive"
    : isPay
      ? "Net Balance to Pay"
      : "Settled";

  return (
    <Card className="relative m-1 overflow-hidden rounded-[2.5rem] border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Accent bar */}
      <div
        className={clsx(
          "absolute inset-y-0 left-0 w-2",
          isReceive
            ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            : isPay
              ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              : "bg-muted"
        )}
      />

      <div className="grid gap-6 px-8 py-10 lg:grid-cols-3 lg:gap-8">
        {/* Left content */}
        <div className="space-y-6 lg:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-70">
            {label}
          </p>

          <h1
            className={clsx(
              "text-5xl font-black lg:text-6xl tracking-tighter",
              isReceive
                ? "text-emerald-600 dark:text-emerald-400"
                : isPay
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground/60"
            )}
          >
            {isReceive ? "+" : isPay ? "-" : ""}
            {currency}
            {formatAmount(Math.abs(netBalance))}
          </h1>

          <Separator className="lg:hidden opacity-30" />

          {/* Totals */}
          <div className="flex gap-12 pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Total Paid</span>
              <span className="text-xl font-black text-rose-500 dark:text-rose-400 tracking-tight">
                -{currency}
                {formatAmount(totalIn)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Total Received</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                +{currency}
                {formatAmount(totalOut)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
