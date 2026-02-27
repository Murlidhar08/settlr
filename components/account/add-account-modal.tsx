"use client"

import {
    Wallet, CheckCircle2, Plus, CreditCard, Banknote, Landmark, Info,
    ChevronDownIcon, User2, Users, Truck, TrendingUp, TrendingDown,
    Briefcase, Scale, Settings2, Tag, Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect, ReactNode } from "react"
import { FinancialAccountType, MoneyType, PartyType, CategoryType } from "@/lib/generated/prisma/enums"
import { addFinancialAccount, updateFinancialAccount } from "@/actions/financial-account.actions"
import { FinancialAccount } from "@/lib/generated/prisma/client"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface AddAccountModalProps {
    title?: string
    accountData?: FinancialAccount
    children: ReactNode
    openInternal?: boolean
    setOpenInternal?: (open: boolean) => void
}

const SUBTYPES_CONFIG: Partial<Record<FinancialAccountType, any>> = {
    [FinancialAccountType.MONEY]: {
        enum: MoneyType,
        field: "moneyType",
        label: "Money Method",
        icons: {
            [MoneyType.CASH]: Banknote,
            [MoneyType.ONLINE]: Landmark,
            [MoneyType.CHEQUE]: CreditCard,
        }
    },
    [FinancialAccountType.CATEGORY]: {
        enum: CategoryType,
        field: "categoryType",
        label: "Account Purpose",
        icons: {
            [CategoryType.INCOME]: TrendingUp,
            [CategoryType.EXPENSE]: TrendingDown,
            [CategoryType.ASSET]: Briefcase,
            [CategoryType.EQUITY]: Scale,
            [CategoryType.ADJUSTMENT]: Settings2,
        }
    }
}

export const AddAccountModal = ({
    title = "Add Account",
    accountData,
    children,
    openInternal,
    setOpenInternal,
}: AddAccountModalProps) => {
    const [openState, setOpenState] = useState(false)
    const open = openInternal !== undefined ? openInternal : openState
    const setOpen = (val: boolean) => {
        if (setOpenInternal) setOpenInternal(val)
        else setOpenState(val)
    }
    const router = useRouter()

    const [data, setData] = useState<{
        name: string;
        type: FinancialAccountType;
        moneyType: MoneyType | null;
        partyType: PartyType | null;
        categoryType: CategoryType | null;
    }>({
        name: "",
        type: FinancialAccountType.MONEY,
        moneyType: MoneyType.CASH,
        partyType: null,
        categoryType: null,
    })

    useEffect(() => {
        if (open) {
            if (accountData) {
                setData({
                    name: accountData.name,
                    type: accountData.type,
                    moneyType: accountData.moneyType || null,
                    partyType: accountData.partyType || null,
                    categoryType: accountData.categoryType || null,
                })
            } else {
                setData({
                    name: "",
                    type: FinancialAccountType.MONEY,
                    moneyType: MoneyType.CASH,
                    partyType: null,
                    categoryType: null,
                })
            }
        }
    }, [open, accountData])

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            if (accountData) {
                return updateFinancialAccount(accountData.id, payload)
            } else {
                return addFinancialAccount(payload)
            }
        },
        onMutate: async (newAccount) => {
            await queryClient.cancelQueries({ queryKey: ["financial-accounts"] })
            const previousAccounts = queryClient.getQueryData(["financial-accounts"])

            queryClient.setQueryData(["financial-accounts"], (old: any) => {
                if (accountData) {
                    return old?.map((a: any) => a.id === accountData.id ? { ...a, ...newAccount } : a)
                }
                return [
                    {
                        ...newAccount,
                        id: `temp-${Date.now()}`,
                        balance: 0,
                        partyId: null,
                        isSystem: false,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    ...(old || []),
                ]
            })

            return { previousAccounts }
        },
        onError: (err, newAccount, context) => {
            queryClient.setQueryData(["financial-accounts"], context?.previousAccounts)
            toast.error("Failed to save account")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["financial-accounts"] })
        },
        onSuccess: () => {
            toast.success(accountData ? "Account updated successfully" : "Account created successfully", {
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            })
            setOpen(false)
        }
    })

    const handleSave = async () => {
        if (!data.name.trim()) {
            return toast.error("Please enter account name")
        }
        mutation.mutate(data)
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }

    return (
        <>
            {children && (
                <div onClick={() => setOpen(true)} className="inline-block cursor-pointer active:scale-95 transition-transform">
                    {children}
                </div>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent
                    side="right"
                    className="w-full! h-full! sm:max-w-[70vw]! lg:max-w-[40vw]! border-l-0 sm:border-l p-0 flex flex-col overflow-hidden bg-background"
                >
                    <SheetHeader className="px-6 py-6 border-b bg-muted/20 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                {accountData ? <Edit2 size={20} /> : <Plus size={20} />}
                            </div>
                            <div>
                                <SheetTitle className="text-xl font-black tracking-tight">
                                    {accountData ? "Edit Account" : "New Account"}
                                </SheetTitle>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    {accountData ? "Modify existing account" : "Setup a new source or category"}
                                </p>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="px-6 py-8 space-y-10"
                        >
                            {/* Account Name */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Account Name</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                        <Wallet size={20} />
                                    </div>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        placeholder="e.g. HDFC Bank, My Cash, Marketing Expense"
                                        className="h-16 pl-12 rounded-2xl border-2 text-lg font-bold transition-all focus:ring-0 focus:border-primary"
                                    />
                                </div>
                            </motion.div>

                            {/* Main Type Selection */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Account Category</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: FinancialAccountType.MONEY, label: "Money", icon: Wallet },
                                        { id: FinancialAccountType.CATEGORY, label: "Business", icon: Tag },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            disabled={accountData?.isSystem}
                                            onClick={() => {
                                                const config = SUBTYPES_CONFIG[type.id];
                                                if (!config) return;
                                                setData({
                                                    ...data,
                                                    type: type.id,
                                                    moneyType: null,
                                                    partyType: null,
                                                    categoryType: null,
                                                    [config.field]: Object.values(config.enum)[0]
                                                });
                                            }}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95",
                                                data.type === type.id
                                                    ? "bg-primary/5 border-primary text-primary shadow-sm"
                                                    : "bg-background border-muted hover:border-primary/30 text-muted-foreground",
                                                accountData?.isSystem && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <type.icon size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Subtype Selection */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={data.type}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 ml-1">
                                        <Info size={12} /> {SUBTYPES_CONFIG[data.type]?.label}
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {SUBTYPES_CONFIG[data.type] && Object.entries(SUBTYPES_CONFIG[data.type]!.enum).map(([key, value]: [string, any]) => {
                                            const Icon = SUBTYPES_CONFIG[data.type]!.icons[value] || Tag;
                                            const field = SUBTYPES_CONFIG[data.type]!.field;
                                            return (
                                                <button
                                                    key={value}
                                                    disabled={accountData?.isSystem}
                                                    onClick={() => setData({ ...data, [field]: value })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 text-center",
                                                        data[field as keyof typeof data] === value
                                                            ? "bg-primary/5 border-primary text-primary shadow-sm"
                                                            : "bg-background border-muted hover:border-primary/30 text-muted-foreground",
                                                        accountData?.isSystem && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    <Icon size={20} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{value}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t bg-background/50 backdrop-blur-md pb-[env(safe-area-inset-bottom,24px)]">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-14 flex-1 rounded-2xl text-base font-bold border-2"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={mutation.isPending}
                                className="h-14 flex-2 rounded-2xl text-primary-foreground text-base font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 active:scale-[0.97] transition-all bg-primary hover:bg-primary/90"
                            >
                                {mutation.isPending ? "Saving..." : (accountData ? "Update Account" : "Create Account")}
                                {!mutation.isPending && <CheckCircle2 size={20} />}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
