"use client"

import { format } from "date-fns"
import { Check, PenSquareIcon, ArrowDownLeft, ArrowUpRight, Clock, Hash, CreditCard } from "lucide-react"
import { BackHeader } from "@/components/back-header"
import { FooterButtons } from "@/components/footer-buttons"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal"
import { DeleteTransactionButton } from "./delete-transaction-button"
import { motion } from "framer-motion"
import { Currency } from "@/lib/generated/prisma/enums"
import { formatAmount, getCurrencySymbol, formatDate, formatTime } from "@/utility/transaction"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"

interface TransactionDetailViewProps {
    transaction: any
    isIn: boolean
    currency?: Currency
}

export function TransactionDetailView({ transaction, isIn, currency = Currency.INR }: TransactionDetailViewProps) {
    const { dateFormat, timeFormat, currency: configCurrency } = useUserConfig()
    const symbol = getCurrencySymbol(configCurrency)
    return (
        <div className="min-h-full bg-background relative">
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden isolate">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ willChange: "transform, opacity" }}
                    className={`absolute -top-1/4 -right-1/4 w-full h-full rounded-full blur-[100px] ${isIn ? "bg-emerald-500/15" : "bg-rose-500/15"}`}
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full blur-[100px] bg-primary/5"
                />
            </div>

            <BackHeader title="Transaction Details" />

            <main className="relative z-10 mx-auto max-w-4xl px-4 pb-36 pt-12 md:px-6">
                <div className="space-y-12">
                    {/* STATUS SECTION */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className={`flex h-24 w-24 items-center justify-center rounded-[2.5rem] shadow-2xl relative group ${isIn
                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                : "bg-rose-500 text-white shadow-rose-500/20"
                                }`}
                        >
                            <div className="absolute inset-0 rounded-[2.5rem] bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Check className="h-10 w-10 relative z-10" />
                        </motion.div>

                        <div className="space-y-1">
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.05 }}
                                className="text-3xl font-black tracking-tighter lg:text-5xl"
                            >
                                Transaction Verified
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 flex items-center justify-center gap-2"
                            >
                                <Clock className="h-3 w-3" />
                                <span suppressHydrationWarning>
                                    {formatDate(transaction.date, dateFormat)} • {formatTime(transaction.date, timeFormat)}
                                </span>
                            </motion.p>
                        </div>
                    </motion.section>

                    {/* AMOUNT CARD */}
                    <motion.section
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative group overflow-hidden rounded-[3rem] border border-border/50 bg-card p-10 text-center shadow-2xl transition-all hover:border-primary/20"
                    >
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${isIn ? "bg-emerald-500" : "bg-rose-500"}`} />

                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-70 mb-4">
                            Financial Impact
                        </p>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-6xl font-black tracking-tighter lg:text-8xl ${isIn ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                }`}
                        >
                            {formatAmount(transaction.amount, configCurrency, true, isIn ? 'IN' : 'OUT')}
                        </motion.p>

                        <div className="mt-8 flex justify-center">
                            <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest border ${isIn
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                    : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                    }`}
                            >
                                {isIn ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                {isIn ? "Inward Remittance" : "Outward Payment"}
                            </motion.span>
                        </div>
                    </motion.section>

                    {/* DETAILS BOX */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-xl p-8 shadow-2xl space-y-8"
                    >
                        <DetailRow icon={<Hash className="h-4 w-4 text-primary" />} label="Reference ID">
                            <span className="font-mono font-black text-sm tracking-tighter opacity-80">
                                {transaction.id.toUpperCase()}
                            </span>
                        </DetailRow>

                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                        <DetailRow icon={<CreditCard className="h-4 w-4 text-primary" />} label={transaction.party ? "Counterparty" : "Origin"}>
                            <div className="flex items-center gap-3">
                                <span className="font-black text-lg tracking-tight">
                                    {transaction.party?.name ?? "Hand Cash"}
                                </span>
                                {!transaction.party && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
                                        Cashbook
                                    </span>
                                )}
                            </div>
                        </DetailRow>

                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                        {/* Payment Instrument removed as mode is gone */}

                        {transaction.description && (
                            <>
                                <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Narrative / Notes</p>
                                    <p className="rounded-[2rem] bg-secondary/50 p-6 text-sm font-medium leading-relaxed border border-border/40 italic">
                                        {transaction.description}
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.section>
                </div>
            </main>

            <FooterButtons>
                <DeleteTransactionButton transaction={transaction} />
                <AddTransactionModal
                    title="Edit Transaction"
                    transactionData={transaction}
                    direction={isIn ? TransactionDirection.IN : TransactionDirection.OUT}
                    partyId={transaction.partyId}
                >
                    <Button
                        size="lg"
                        className="px-12 flex-1 h-16 rounded-full gap-4 font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 bg-primary text-primary-foreground"
                    >
                        <PenSquareIcon className="h-5 w-5" />
                        Update Record
                    </Button>
                </AddTransactionModal>
            </FooterButtons>
        </div>
    )
}

function DetailRow({
    label,
    icon,
    children,
}: {
    label: string
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-6 px-2">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 shadow-inner">
                    {icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70 leading-none">{label}</span>
            </div>
            {children}
        </div>
    )
}
