"use client"

import { FinancialAccount } from "@/lib/generated/prisma/client"
import { CategoryType, Currency, FinancialAccountType, MoneyType } from "@/lib/generated/prisma/enums"
import { cn } from "@/lib/utils"
import { useFinancialAccountBalance } from "@/tanstacks/financial-account"
import { formatAmount } from "@/utility/commonFunction"
import { getCurrencySymbol } from "@/utility/transaction"
import { motion } from "framer-motion"
import {
    ArrowDownLeft, ArrowDownToLine, ArrowUpFromLine, ArrowUpRight,
    Banknote,
    Briefcase,
    ChevronRight,
    Cpu,
    CreditCard, Edit2,
    Landmark,
    Scale, Settings2, ShieldAlert, Tag,
    TrendingDown,
    TrendingUp,
    Wallet
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserConfig } from "../providers/user-config-provider"
import { AddAccountModal } from "./add-account-modal"

interface AccountCardProps {
    account: FinancialAccount
    index: number
    currency: Currency
}

export const AccountCard = ({ account, index, currency }: AccountCardProps) => {
    const router = useRouter()
    const { defAccId, defIncomeAccId, defExpenseAccId } = useUserConfig()
    const isDefaultAcc = defAccId === account.id
    const isDefaultIncome = defIncomeAccId === account.id
    const isDefaultExpense = defExpenseAccId === account.id

    const { balance, isLoading } = useFinancialAccountBalance(account.id);

    const getColors = () => {
        if (account.type === FinancialAccountType.MONEY) {
            if (account.moneyType === MoneyType.ONLINE) return "from-slate-900 to-indigo-950 text-white border-white/10 dark:from-slate-950 dark:to-neutral-950";
            if (account.moneyType === MoneyType.CASH) return "from-emerald-600 to-emerald-800 text-white border-white/10";
            if (account.moneyType === MoneyType.CHEQUE) return "from-amber-600 to-orange-700 text-white border-white/10";
        }
        if (account.type === FinancialAccountType.CATEGORY) {
            if (account.categoryType === CategoryType.INCOME) return "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-100 dark:border-emerald-500/30";
            if (account.categoryType === CategoryType.EXPENSE) return "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-500/10 dark:text-rose-100 dark:border-rose-500/30";
            if (account.categoryType === CategoryType.ASSET) return "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-500/10 dark:text-sky-100 dark:border-sky-500/30";
            if (account.categoryType === CategoryType.EQUITY) return "bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-500/10 dark:text-violet-100 dark:border-violet-500/30";
            if (account.categoryType === CategoryType.ADJUSTMENT) return "bg-slate-100 text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700";
        }
        return "bg-card text-foreground border-border/50";
    };

    const getIcon = () => {
        const size = 24;
        switch (account.type) {
            case FinancialAccountType.MONEY:
                if (account.moneyType === MoneyType.CASH) return <Banknote size={size} />;
                if (account.moneyType === MoneyType.ONLINE) return <Landmark size={size} />;
                if (account.moneyType === MoneyType.CHEQUE) return <CreditCard size={size} />;
                return <Wallet size={size} />;
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
    };

    const isMoneyOnline = account.type === FinancialAccountType.MONEY && account.moneyType === MoneyType.ONLINE;
    const isMoneyCash = account.type === FinancialAccountType.MONEY && account.moneyType === MoneyType.CASH;
    const isMoneyCheque = account.type === FinancialAccountType.MONEY && account.moneyType === MoneyType.CHEQUE;

    // isDarkCard means the card has a fixed dark background (usually gradient) across both modes
    const isDarkCard = isMoneyOnline || isMoneyCash || isMoneyCheque;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => router.push(`/accounts/${account.id}` as any)}
            className={cn(
                "group relative overflow-hidden p-6 rounded-[2.5rem] border-2 shadow-sm transition-all duration-300 cursor-pointer",
                "bg-linear-to-br",
                getColors(),
                !account.isActive && "grayscale opacity-60 contrast-75"
            )}
        >
            {/* ATM Card Style Elements */}
            {isMoneyOnline && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-12 rounded-lg bg-linear-to-br from-amber-400 to-amber-200/50 opacity-80 backdrop-blur-sm shadow-inner flex items-center justify-center">
                    <Cpu className="text-amber-900/40" size={24} />
                </div>
            )}

            {/* Banknote Style Elements */}
            {isMoneyCash && (
                <>
                    <div className="absolute inset-4 border border-white/25 rounded-[1.5rem] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border-2 border-white/10 flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full border border-white/10" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black opacity-20 text-6xl">
                        {getCurrencySymbol(currency)}
                    </div>
                </>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <div className="flex items-start justify-between">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isDarkCard ? "bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20" : "bg-primary/5 group-hover:bg-primary/10"
                    )}>
                        {getIcon()}
                    </div>

                    {/* Loading State */}
                    {balance == null && (
                        <div className="flex flex-col items-end">
                            <p className={cn(
                                "text-2xl font-black tracking-tighter tabular-nums",
                                !isDarkCard && "text-gray-500"
                            )}>
                                {getCurrencySymbol(currency)}{"---"}
                            </p>
                            <div className="flex items-center gap-1 opacity-60">
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                    {"Loading"}
                                </span>
                            </div>
                        </div>
                    )}


                    {balance !== undefined && !isLoading && (
                        <div className="flex flex-col items-end">
                            <p className={cn(
                                "text-2xl font-black tracking-tighter tabular-nums",
                                !isDarkCard && (balance > 0 ? "text-emerald-500" : balance < 0 ? "text-rose-500" : "")
                            )}>
                                {getCurrencySymbol(currency)}{formatAmount(balance)}
                            </p>
                            <div className="flex items-center gap-1 opacity-60">
                                {balance >= 0 ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                    {balance >= 0 ? "Balance" : "Debt"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[70%]">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {isDefaultAcc && (
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                    isDarkCard ? "bg-white/10 border-white/20 text-white" : "bg-primary/5 border-primary/10 text-primary"
                                )}>
                                    <ShieldAlert size={8} strokeWidth={3} />
                                    Primary
                                </div>
                            )}
                            {isDefaultIncome && (
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                    isDarkCard ? "bg-white/10 border-white/20 text-white" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                )}>
                                    <ArrowDownToLine size={8} strokeWidth={3} />
                                    Def. Income
                                </div>
                            )}
                            {isDefaultExpense && (
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                    isDarkCard ? "bg-white/10 border-white/20 text-white" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                )}>
                                    <ArrowUpFromLine size={8} strokeWidth={3} />
                                    Def. Expense
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-black tracking-tight leading-none group-hover:translate-x-1 transition-transform">{account.name}</h3>
                        <p className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] truncate",
                            isDarkCard ? "opacity-60" : "text-muted-foreground/60"
                        )}>
                            {account.moneyType || account.partyType || account.categoryType || account.type}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                            <AddAccountModal accountData={account}>
                                <div className={cn(
                                    "p-3 rounded-xl transition-all cursor-pointer backdrop-blur-md",
                                    isDarkCard ? "bg-white/10 hover:bg-white text-white hover:text-slate-900" : "bg-muted hover:bg-primary hover:text-primary-foreground"
                                )}>
                                    <Edit2 size={14} className="stroke-2" />
                                </div>
                            </AddAccountModal>
                        </div>
                        <div className={cn(
                            "p-3 rounded-xl transition-all backdrop-blur-md",
                            isDarkCard ? "bg-white/5 text-white" : "bg-muted/50 text-muted-foreground"
                        )}>
                            <ChevronRight size={14} className="stroke-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating particle for non-card types */}
            {!isMoneyOnline && !isMoneyCash && (
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </motion.div>
    );
};
