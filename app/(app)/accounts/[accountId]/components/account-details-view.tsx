"use client"

import { motion } from "framer-motion"
import {
    Wallet, ArrowUpRight, ArrowDownLeft, Receipt, Landmark, Banknote,
    Tag, User2, Users, Truck, TrendingUp, TrendingDown,
    Briefcase, Scale, Settings2, CreditCard, ChevronRight, History
} from "lucide-react"
import { FinancialAccountType, MoneyType, CategoryType, PartyType, Currency } from "@/lib/generated/prisma/enums"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { cn } from "@/lib/utils"
import { getCurrencySymbol, formatAmount } from "@/utility/transaction"
import { TransactionList } from "@/components/transaction/transaction-list"
import { FooterButtons } from "@/components/footer-buttons"
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal"
import { Button } from "@/components/ui/button"
import BackAccountHeaderClient from "./back-account-header-client"

interface AccountDetailsViewProps {
    account: any
    transactions: any[]
    stats: {
        totalIn: number
        totalOut: number
        balance: number
    }
    currency: Currency
    language: string
}

export function AccountDetailsView({ account, transactions, stats, currency, language }: AccountDetailsViewProps) {
    const symbol = getCurrencySymbol(currency)

    const getIcon = (size = 24) => {
        switch (account.type) {
            case FinancialAccountType.MONEY:
                if (account.moneyType === MoneyType.CASH) return <Banknote size={size} />;
                if (account.moneyType === MoneyType.ONLINE) return <Landmark size={size} />;
                if (account.moneyType === MoneyType.CHEQUE) return <CreditCard size={size} />;
                return <Wallet size={size} />;
            case FinancialAccountType.PARTY:
                if (account.partyType === PartyType.CUSTOMER) return <User2 size={size} />;
                if (account.partyType === PartyType.SUPPLIER) return <Truck size={size} />;
                return <Users size={size} />;
            case FinancialAccountType.CATEGORY:
                if (account.categoryType === CategoryType.INCOME) return <TrendingUp size={size} />;
                if (account.categoryType === CategoryType.EXPENSE) return <TrendingDown size={size} />;
                if (account.categoryType === CategoryType.ASSET) return <Briefcase size={size} />;
                if (account.categoryType === CategoryType.EQUITY) return <Scale size={size} />;
                if (account.categoryType === CategoryType.ADJUSTMENT) return <Settings2 size={size} />;
                return <Tag size={size} />;
            default:
                return <Wallet size={size} />;
        }
    }

    const isDarkCard = true; // All our hero variants now use fixed high-contrast gradients

    const getThemeColors = () => {
        const isPositive = stats.balance >= 0;

        if (account.type === FinancialAccountType.MONEY && account.moneyType === MoneyType.ONLINE) {
            return isPositive
                ? "from-slate-900 to-indigo-950 text-white"
                : "from-slate-900 to-rose-950 text-white";
        }

        if (isPositive) {
            return "from-emerald-600 to-emerald-800 text-white";
        } else {
            return "from-rose-600 to-rose-800 text-white";
        }
    }

    return (
        <div className="min-h-full bg-background relative overflow-x-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden isolate">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full blur-[120px] bg-primary/10"
                />
            </div>

            <BackAccountHeaderClient account={account} />

            <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 space-y-12">
                {/* Hero Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "relative overflow-hidden rounded-[3rem] p-8 shadow-2xl border-2 border-white/10 bg-linear-to-br",
                        getThemeColors()
                    )}
                >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20",
                                    isDarkCard ? "bg-white/10" : "bg-primary/10 text-primary"
                                )}>
                                    {getIcon(28)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight">{account.name}</h1>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                        {account.moneyType || account.partyType || account.categoryType || account.type}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Current Standing</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter tabular-nums">
                                        {symbol}{Math.abs(stats.balance).toLocaleString()}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest",
                                        stats.balance >= 0 ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"
                                    )}>
                                        {stats.balance >= 0 ? "CR" : "DR"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:w-1/3">
                            <div className="space-y-2 rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <ArrowDownLeft size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Total In</span>
                                </div>
                                <p className="text-xl font-black tabular-nums">{symbol}{stats.totalIn.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2 rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-rose-400">
                                    <ArrowUpRight size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Total Out</span>
                                </div>
                                <p className="text-xl font-black tabular-nums">{symbol}{stats.totalOut.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Card Elements */}
                    {account.type === FinancialAccountType.MONEY && account.moneyType === MoneyType.ONLINE && (
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard size={120} className="rotate-12" />
                        </div>
                    )}
                </motion.div>

                {/* Ledger Description */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card/30 backdrop-blur-md rounded-[2.5rem] p-8 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-sm"
                >
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-inner">
                            <History size={32} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black tracking-tight leading-none">Journal entries</h3>
                            <p className="text-xs text-muted-foreground font-medium">Verified transaction history for {account.name}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Transaction List */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="h-1 w-12 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/70">Statement Ledger</h2>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            {transactions.length} Total Records
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <TransactionList
                            transactions={transactions as any}
                            accountId={account.id}
                            accountType={account.type}
                        />
                    </motion.div>
                </div>
            </main>

            <FooterButtons>
                {/* OUT Button */}
                <AddTransactionModal
                    title="Account Outflow"
                    accountId={account.id}
                    direction={TransactionDirection.OUT}
                    path={`/accounts/${account.id}`}
                >
                    <Button
                        size="lg"
                        className="px-8 flex-1 h-16 rounded-[1.5rem] gap-3 font-black uppercase tracking-widest bg-rose-500 text-white shadow-2xl shadow-rose-500/20 transition-all hover:bg-rose-600 hover:-translate-y-1 active:scale-95 border-b-4 border-rose-700"
                    >
                        <ArrowUpRight className="h-5 w-5" />
                        Pay Out
                    </Button>
                </AddTransactionModal>

                {/* IN Button */}
                <AddTransactionModal
                    title="Account Inflow"
                    accountId={account.id}
                    direction={TransactionDirection.IN}
                    path={`/accounts/${account.id}`}
                >
                    <Button
                        size="lg"
                        className="px-8 flex-1 h-16 rounded-[1.5rem] gap-3 font-black uppercase tracking-widest bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:-translate-y-1 active:scale-95 border-b-4 border-emerald-700"
                    >
                        <ArrowDownLeft className="h-5 w-5" />
                        Receive
                    </Button>
                </AddTransactionModal>
            </FooterButtons>
        </div>
    );
}
