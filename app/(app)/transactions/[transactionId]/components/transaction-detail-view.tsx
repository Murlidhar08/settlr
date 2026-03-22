"use client"

import { deleteTransaction } from "@/actions/transaction.actions"
import { BackHeader } from "@/components/back-header"
import { useConfirm } from "@/components/providers/confirm-provider"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal"
import { Currency } from "@/lib/generated/prisma/enums"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { formatAmount, formatDate, formatTime } from "@/utility/transaction"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock, Hash, History, Pencil, PenSquareIcon, Phone, Trash2, User } from "lucide-react"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface TransactionDetailViewProps {
    transaction: any
    isIn: boolean
    currency?: Currency
}

export function TransactionDetailView({ transaction, isIn, currency = Currency.INR }: TransactionDetailViewProps) {
    const { dateFormat, timeFormat, currency: configCurrency } = useUserConfig()
    const confirm = useConfirm()
    const router = useRouter()
    const [isEditOpen, setIsEditOpen] = useState(false)

    const onDelete = async () => {
        const ok = await confirm({
            title: "Delete transaction?",
            description: "This action cannot be undone.",
            confirmText: "Yes, delete",
            destructive: true,
        })

        if (!ok) return

        await deleteTransaction(transaction.id)
        router.back()
    }

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

            <BackHeader
                title="Transaction Details"
                description={transaction.description}
                menuItems={[
                    {
                        icon: <Pencil size={18} />,
                        label: "Edit",
                        onClick: () => setIsEditOpen(true),
                        destructive: false
                    },
                    {
                        icon: <Trash2 size={18} />,
                        label: "Delete",
                        onClick: async () => await onDelete(),
                        destructive: true
                    }
                ]}
            />

            <main className="relative z-10 mx-auto max-w-6xl px-4 pb-36 pt-12 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

                    {/* LEFT COLUMN: BADGE & AMOUNT (Fixed/Sticky on Desktop) */}
                    <div className="lg:col-span-2 space-y-10 lg:sticky lg:top-28 h-fit">
                        {/* STATUS SECTION */}
                        <motion.section
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
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

                            <div className="space-y-2">
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.05 }}
                                    className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl"
                                >
                                    Transaction Verified
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 flex items-center justify-center lg:justify-start gap-2"
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
                            className="relative group overflow-hidden rounded-[3rem] border border-border/50 bg-card p-8 sm:p-10 text-center lg:text-left shadow-2xl transition-all hover:border-primary/20"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${isIn ? "bg-emerald-500" : "bg-rose-500"}`} />

                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-70 mb-6">
                                Financial Impact
                            </p>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`text-5xl font-black tracking-tighter sm:text-6xl break-all ${isIn ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                    }`}
                            >
                                {formatAmount(transaction.amount, configCurrency, true, isIn ? 'IN' : 'OUT')}
                            </motion.p>

                            <div className="mt-8 flex justify-center lg:justify-start">
                                <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] border ${isIn
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                        : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                        }`}
                                >
                                    {isIn ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                    {isIn ? "Inward Remittance" : "Outward Payment"}
                                </motion.span>
                            </div>
                        </motion.section>
                    </div>

                    {/* RIGHT COLUMN: DETAILS BOX */}
                    <div className="lg:col-span-3">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-14 relative overflow-hidden"
                        >
                            {/* Money Flow Visualization */}
                            <div className="space-y-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Transaction Chain</p>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted/20 p-8 sm:p-10 rounded-[2.5rem] border border-border/10 relative">
                                    <AccountNode account={transaction.fromAccount} label="From" isSource={true} />
                                    <div className="h-14 w-14 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-lg relative z-10 shrink-0">
                                        <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                                    </div>
                                    <AccountNode account={transaction.toAccount} label="To" isSource={false} />
                                </div>
                            </div>

                            <div className="space-y-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Core Information</p>

                                <div className="space-y-6">
                                    <DetailRow icon={<Hash className="h-4 w-4 text-primary" />} label="Reference ID">
                                        <span className="font-mono font-black opacity-80 text-right text-xs break-all">
                                            {transaction.id}
                                        </span>
                                    </DetailRow>

                                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                                    {transaction.party && (
                                        <>
                                            <DetailRow icon={<User className="h-4 w-4 text-primary" />} label="Linked Party">
                                                <div className="text-right">
                                                    <p className="font-black text-xl tracking-tight">{transaction.party.name}</p>
                                                    {transaction.party.contactNo && (
                                                        <p className="text-[10px] font-bold text-muted-foreground flex items-center justify-end gap-1.5 mt-1">
                                                            <Phone size={12} className="opacity-60" /> {transaction.party.contactNo}
                                                        </p>
                                                    )}
                                                </div>
                                            </DetailRow>
                                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
                                        </>
                                    )}

                                    <DetailRow icon={<PenSquareIcon className="h-4 w-4 text-primary" />} label="Recorded By">
                                        <span className="font-black text-lg opacity-90 text-right">
                                            {transaction.user.name}
                                        </span>
                                    </DetailRow>

                                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                                    <DetailRow icon={<CalendarDays className="h-4 w-4 text-primary" />} label="Created On">
                                        <span className="font-bold opacity-80 text-right text-xs">
                                            {formatDate(transaction.createdAt, dateFormat)} — {formatTime(transaction.createdAt, timeFormat)}
                                        </span>
                                    </DetailRow>

                                    {transaction.updatedAt > transaction.createdAt && (
                                        <>
                                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
                                            <DetailRow icon={<History className="h-4 w-4 text-primary" />} label="Last Modified">
                                                <span className="font-bold opacity-80 text-right text-xs">
                                                    {formatDate(transaction.updatedAt, dateFormat)} — {formatTime(transaction.updatedAt, timeFormat)}
                                                </span>
                                            </DetailRow>
                                        </>
                                    )}
                                </div>
                            </div>

                            {transaction.description && (
                                <div className="pt-6">
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Narrative / Notes</p>
                                        <div className="rounded-[2.5rem] bg-secondary/30 p-10 text-base font-semibold leading-relaxed border border-border/20 relative group">
                                            <div className="absolute top-6 right-8 text-[60px] font-black italic text-border/20 pointer-events-none select-none leading-none">“</div>
                                            <p className="italic opacity-80 relative z-10">{transaction.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.section>
                    </div>
                </div>
            </main>

            <AddTransactionModal
                title="Edit Transaction"
                transactionData={transaction}
                direction={isIn ? TransactionDirection.IN : TransactionDirection.OUT}
                partyId={transaction.partyId}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            >
                <></>
            </AddTransactionModal>
        </div>
    )
}

function AccountNode({ account, label, isSource }: { account: any, label: string, isSource: boolean }) {
    return (
        <div className="flex flex-col items-center text-center space-y-3 flex-1 px-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 leading-none">{label}</span>
            <div className={`p-4 rounded-2xl w-full max-w-[160px] flex items-center justify-center shadow-md border ${isSource ? "bg-background border-border" : "bg-primary/5 border-primary/20"}`}>
                <div className="flex flex-col items-center gap-1 overflow-hidden">
                    <span className="font-black text-sm tracking-tight truncate w-full px-1">{account.name}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 truncate w-full">
                        {account.categoryType || account.moneyType || account.type}
                    </span>
                </div>
            </div>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-2">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 shadow-inner">
                    {icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70 leading-none">{label}</span>
            </div>
            <div className="w-full sm:w-auto overflow-hidden text-right">
                {children}
            </div>
        </div>
    )
}
