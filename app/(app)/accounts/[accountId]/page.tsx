import { Suspense } from "react";
import { Header } from "@/components/header";
import BackAccountHeaderClient from "./components/back-account-header-client";
import { getAccountTransactions } from "@/actions/transaction.actions";
import { TransactionList } from "@/components/transaction/transaction-list";
import { Card } from "@/components/ui/card";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar as CalendarIcon,
    Receipt,
    Landmark,
    Banknote,
    Tag,
    User2
} from "lucide-react";
import { FinancialAccountType, MoneyType, CategoryType } from "@/lib/generated/prisma/enums";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function AccountDetailsPage({ params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;

    return (
        <div className="w-full bg-background min-h-screen">
            <Suspense fallback={<AccountDetailsSkeleton />}>
                <AccountContent accountId={accountId} />
            </Suspense>
        </div>
    );
}

async function AccountContent({ accountId }: { accountId: string }) {
    const { account, transactions } = await getAccountTransactions(accountId);

    const totalIn = transactions
        .filter(t => t.toAccountId === accountId)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = transactions
        .filter(t => t.fromAccountId === accountId)
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIn - totalOut;

    const getIcon = () => {
        switch (account.type) {
            case FinancialAccountType.MONEY:
                if (account.moneyType === MoneyType.CASH) return <Banknote size={32} className="text-emerald-500" />;
                if (account.moneyType === MoneyType.ONLINE) return <Landmark size={32} className="text-blue-500" />;
                return <Wallet size={32} className="text-primary" />;
            case FinancialAccountType.PARTY:
                return <User2 size={32} className="text-indigo-500" />;
            case FinancialAccountType.CATEGORY:
                return <Tag size={32} className="text-primary" />;
            default:
                return <Wallet size={32} className="text-primary" />;
        }
    };

    return (
        <div className="w-full bg-background pb-28">
            <BackAccountHeaderClient account={account as any} />

            <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
                {/* Stats Summary Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 rounded-3xl border-2 flex flex-col gap-4 bg-muted/5 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                {getIcon()}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Balance</span>
                        </div>
                        <p className={cn(
                            "text-3xl font-black tabular-nums",
                            balance >= 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                            ₹{Math.abs(balance).toLocaleString()}
                            <span className="text-xs font-bold ml-1 opacity-60">
                                {balance >= 0 ? "CR" : "DR"}
                            </span>
                        </p>
                    </Card>

                    <Card className="p-6 rounded-3xl border-2 flex flex-col gap-4 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <ArrowDownLeft size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Total In</span>
                        </div>
                        <p className="text-3xl font-black text-emerald-600 tabular-nums">₹{totalIn.toLocaleString()}</p>
                    </Card>

                    <Card className="p-6 rounded-3xl border-2 flex flex-col gap-4 bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                                <ArrowUpRight size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600/60">Total Out</span>
                        </div>
                        <p className="text-3xl font-black text-rose-600 tabular-nums">₹{totalOut.toLocaleString()}</p>
                    </Card>
                </div>

                {/* Ledger Description */}
                <div className="bg-muted/10 rounded-3xl p-6 border-2 border-dashed border-muted flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-background border shadow-sm flex items-center justify-center text-muted-foreground/40">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Ledger Statement</p>
                            <p className="text-xs text-muted-foreground">Showing history for <span className="text-foreground font-semibold">{account.name}</span></p>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="h-1 w-8 bg-primary rounded-full" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Statement Entries</h2>
                    </div>
                    <TransactionList transactions={transactions as any} />
                </div>
            </div>
        </div>
    );
}

function AccountDetailsSkeleton() {
    return (
        <div className="w-full bg-background animate-pulse">
            <div className="h-64 bg-muted/20" />
            <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-12">
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/20 rounded-3xl" />)}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-muted/10 rounded-2xl" />)}
                </div>
            </div>
        </div>
    );
}
