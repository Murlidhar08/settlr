import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { getUserConfig } from "@/lib/user-config";
import { FinancialAccountType } from "@/lib/generated/prisma/enums";
import { formatAmount } from "@/utility/transaction";
import { TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react";

export async function BudgetAlerts() {
    const session = await getUserSession();
    const { currency } = await getUserConfig();
    const businessId = session?.user.activeBusinessId;

    if (!businessId) return null;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Fetch transactions for the current month
    const transactions = await prisma.transaction.findMany({
        where: {
            businessId,
            date: { gte: startOfMonth }
        },
        include: {
            fromAccount: { select: { name: true, type: true } },
            toAccount: { select: { name: true, type: true } }
        }
    });

    const categories: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
        const amount = Number(tx.amount);
        // Expense categorization
        if (tx.fromAccount.type === FinancialAccountType.MONEY && tx.toAccount.type === FinancialAccountType.CATEGORY) {
            categories[tx.toAccount.name] = (categories[tx.toAccount.name] || 0) + amount;
            totalExpense += amount;
        }
        // Income categorization
        if (tx.fromAccount.type === FinancialAccountType.CATEGORY && tx.toAccount.type === FinancialAccountType.MONEY) {
            totalIncome += amount;
        }
    });

    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const topExpense = sortedCategories[0];

    return (
        <div className="space-y-4">
            {/* Top Expense Insight */}
            {topExpense && (
                <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Spending Insight</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                        Your highest expense this month is <span className="font-bold">"{topExpense[0]}"</span> at <span className="font-bold text-amber-700 dark:text-amber-300">{formatAmount(topExpense[1], currency)}</span>.
                    </p>
                </div>
            )}

            {/* Savings Reflection */}
            <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Info size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Monthly Summary</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Monthly Inflow</span>
                        <span className="text-xs font-bold text-emerald-600">+{formatAmount(totalIncome, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Monthly Outflow</span>
                        <span className="text-xs font-bold text-rose-600">-{formatAmount(totalExpense, currency)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-indigo-100/50 dark:border-indigo-500/10 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">Balance</span>
                        <span className={`text-sm font-black ${totalIncome >= totalExpense ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {totalIncome >= totalExpense ? '+' : ''}{formatAmount(totalIncome - totalExpense, currency)}
                        </span>
                    </div>
                </div>
            </div>

            {!topExpense && transactions.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs text-muted-foreground/60 italic">No specific spending alerts for this month.</p>
                </div>
            )}
        </div>
    );
}
