"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { tran } from "@/lib/languages/i18n";
import { useBudgetInsights } from "@/tanstacks/dashboard";
import { formatAmount } from "@/utility/transaction";
import { AlertCircle, Info } from "lucide-react";

export function BudgetAlerts() {
    const { data: insights, isLoading } = useBudgetInsights();

    if (isLoading) {
        return <BudgetAlertsSkeleton />;
    }

    if (!insights) return null;

    const { totalIncome, totalExpense, topExpense, hasTransactions } = insights;

    return (
        <div className="space-y-4">
            {/* Top Expense Insight */}
            {topExpense && (
                <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tran("dashboard.spending_insight")}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                        {tran("dashboard.highest_expense_msg", { name: topExpense[0], amount: formatAmount(topExpense[1]) })}
                    </p>
                </div>
            )}

            {/* Savings Reflection */}
            <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Info size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tran("dashboard.monthly_summary")}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{tran("dashboard.monthly_inflow")}</span>
                        <span className="text-xs font-bold text-emerald-600">+{formatAmount(totalIncome)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{tran("dashboard.monthly_outflow")}</span>
                        <span className="text-xs font-bold text-rose-600">-{formatAmount(totalExpense)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-indigo-100/50 dark:border-indigo-500/10 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">{tran("dashboard.balance")}</span>
                        <span className={`text-sm font-black ${totalIncome >= totalExpense ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {totalIncome >= totalExpense ? '+' : ''}{formatAmount(totalIncome - totalExpense)}
                        </span>
                    </div>
                </div>
            </div>

            {!topExpense && hasTransactions && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs text-muted-foreground/60 italic">{tran("dashboard.no_spending_alerts")}</p>
                </div>
            )}
        </div>
    );
}

export function BudgetAlertsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Top Expense Insight Skeleton */}
            <div className="p-5 rounded-3xl bg-muted/10 border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-full rounded-lg" />
            </div>

            {/* Savings Reflection Skeleton */}
            <div className="p-5 rounded-3xl bg-muted/10 border border-border/50 space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/50 flex items-center justify-between">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}
