"use client"

import { getAccountTransactions } from "@/actions/transaction.actions"
import { FooterButtons } from "@/components/footer-buttons"
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal"
import { TransactionList } from "@/components/transaction/transaction-list"
import { Button } from "@/components/ui/button"
import { CategoryType, Currency, FinancialAccountType, MoneyType, PartyType } from "@/lib/generated/prisma/enums"
import { cn } from "@/lib/utils"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { formatAmount } from "@/utility/commonFunction"
import { getCurrencySymbol } from "@/utility/transaction"
import { motion } from "framer-motion"
import {
    ArrowDownLeft,
    ArrowUpRight,
    Banknote,
    Briefcase,
    CreditCard,
    Landmark,
    Loader2,
    Plus,
    Scale, Settings2,
    Tag,
    TrendingDown,
    TrendingUp,
    Truck,
    User2, Users,
    Wallet
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import BackAccountHeaderClient from "./back-account-header-client"

import { useAccountStats, useAccountTransactions } from "@/tanstacks/financial-account"
import { AccountDetailsSkeleton } from "./account-details-skeleton"

interface AccountDetailsViewProps {
    accountId: string
    currency: Currency
    language: string
}

export function AccountDetailsView({ accountId, currency, language }: AccountDetailsViewProps) {
    const symbol = getCurrencySymbol(currency)
    const { data: statsData, isLoading: statsLoading } = useAccountStats(accountId)
    const { data: transData, isLoading: transLoading } = useAccountTransactions(accountId)

    const [transactions, setTransactions] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        if (transData) {
            setTransactions(transData.transactions)
            setHasMore(transData.transactions.length < transData.totalTransactions)
        }
    }, [transData])

    const { account } = transData || {}
    const stats = statsData
    const totalTransactions = transData?.totalTransactions

    const lastTransactionRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading || !transData) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [loading, hasMore, transData]
    )

    useEffect(() => {
        if (page === 1 || !transData || !account) return

        const loadMoreTransactions = async () => {
            setLoading(true)
            try {
                const { transactions: nextTransactions } = await getAccountTransactions(account.id, {
                    page,
                    limit: 20,
                })

                if (nextTransactions.length < 20) {
                    setHasMore(false)
                }
                setTransactions((prev) => [...prev, ...nextTransactions])
            } catch (error) {
                console.error("Failed to load more transactions:", error)
            } finally {
                setLoading(false)
            }
        }

        loadMoreTransactions()
    }, [page, account, totalTransactions, transData])

    if (statsLoading || transLoading || stats == undefined) {
        return <AccountDetailsSkeleton />
    }

    if (!statsData || !transData || !account) return null

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
        <>
            <BackAccountHeaderClient account={account} />

            <div className="w-full bg-background relative pb-32">
                <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 space-y-12">
                    {/* Hero Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl border-2 border-white/10 bg-linear-to-br transition-all duration-500",
                            getThemeColors(),
                            !account.isActive && "grayscale opacity-60 contrast-75"
                        )}
                    >
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20",
                                        isDarkCard ? "bg-white/10" : "bg-primary/10 text-primary"
                                    )}>
                                        {getIcon(24)}
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-black tracking-tight">{account.name}</h1>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                            {account.moneyType || account.partyType || account.categoryType || account.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Current Standing</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-5xl font-black tracking-tighter tabular-nums">
                                            {symbol}{formatAmount(stats.balance)}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-widest",
                                            stats.balance >= 0 ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"
                                        )}>
                                            {stats.balance >= 0 ? "CR" : "DR"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:w-1/3">
                                <div className="space-y-1.5 sm:space-y-2 rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <ArrowDownLeft size={14} className="sm:size-4" />
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Total In</span>
                                    </div>
                                    <p className="text-lg sm:text-xl font-black tabular-nums">{symbol}{formatAmount(stats.totalIn)}</p>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2 rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-rose-400">
                                        <ArrowUpRight size={14} className="sm:size-4" />
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Total Out</span>
                                    </div>
                                    <p className="text-lg sm:text-xl font-black tabular-nums">{symbol}{formatAmount(stats.totalOut)}</p>
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

                    {/* Transaction List */}
                    <div className="space-y-8">
                        <div className={cn("flex items-center justify-between px-2", !account.isActive && "grayscale-50")}>
                            <div className="flex items-center gap-4">
                                <div className="h-1 w-12 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/70">Statement Ledger</h2>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                {totalTransactions} Total Records
                            </div>
                        </div>

                        <motion.div
                            className={cn(!account.isActive && "grayscale-50")}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <TransactionList
                                transactions={transactions as any}
                                accountId={account.id}
                                accountType={account.type}
                            />

                            {/* Infinite Scroll Trigger */}
                            <div
                                ref={lastTransactionRef}
                                className="h-20 flex items-center justify-center mt-8"
                            >
                                {loading && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Loader2 className="size-5 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Loading more...</span>
                                    </div>
                                )}
                                {!hasMore && transactions.length > 0 && (
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">End of records</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Add Transaction Button */}
                {account.isActive && (
                    <FooterButtons>
                        <AddTransactionModal
                            title="New Entry"
                            accountId={account.id}
                            direction={TransactionDirection.OUT}
                            path={`/accounts/${account.id}`}
                        >
                            <Button className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
                                <Plus className="size-6 sm:size-5" />
                                <span className="hidden md:block text-center font-black tracking-[0.2em] text-sm">
                                    Add Entry
                                </span>
                            </Button>
                        </AddTransactionModal>
                    </FooterButtons>
                )}
            </div>
        </>
    );
}
