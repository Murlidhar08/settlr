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
    <Card className="relative m-1 overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Accent bar */}
      <div
        className={clsx(
          "absolute inset-y-0 left-0 w-1.5",
          isReceive
            ? "bg-emerald-500"
            : isPay
              ? "bg-rose-500"
              : "bg-muted"
        )}
      />

      <div className="grid gap-6 px-5 py-6 lg:grid-cols-3 lg:gap-8">
        {/* Left content */}
        <div className="space-y-4 lg:col-span-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <h1
            className={clsx(
              "text-4xl font-bold lg:text-5xl",
              isReceive
                ? "text-emerald-700"
                : isPay
                  ? "text-rose-600"
                  : "text-muted-foreground"
            )}
          >
            {isReceive ? "+" : isPay ? "-" : ""}
            {currency}
            {formatAmount(Math.abs(netBalance))}
          </h1>

          <Separator className="lg:hidden" />

          {/* Totals */}
          <div className="flex gap-8 pt-2">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total In</span>
              <span className="text-lg font-semibold text-emerald-600">
                +{currency}
                {formatAmount(totalIn)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Out</span>
              <span className="text-lg font-semibold text-rose-500">
                -{currency}
                {formatAmount(totalOut)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
