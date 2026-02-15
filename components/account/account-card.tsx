"use client"

import {
    Wallet, Banknote, Landmark, CreditCard, Edit2, User2, Users, Truck,
    TrendingUp, TrendingDown, Briefcase, Scale, Settings2, Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialAccount } from "@/lib/generated/prisma/client"
import { MoneyType, FinancialAccountType, CategoryType, PartyType } from "@/lib/generated/prisma/enums"
import { AddAccountModal } from "./add-account-modal"
import { motion } from "framer-motion"

import { useRouter } from "next/navigation"

interface AccountCardProps {
    account: FinancialAccount & { balance: number }
    index: number
}

export const AccountCard = ({ account, index }: AccountCardProps) => {
    const router = useRouter()

    const getIcon = () => {
        const size = 24;
        switch (account.type) {
            case FinancialAccountType.MONEY:
                if (account.moneyType === MoneyType.CASH) return <Banknote size={size} className="text-emerald-500" />;
                if (account.moneyType === MoneyType.ONLINE) return <Landmark size={size} className="text-blue-500" />;
                if (account.moneyType === MoneyType.CHEQUE) return <CreditCard size={size} className="text-amber-500" />;
                return <Wallet size={size} className="text-primary" />;

            case FinancialAccountType.PARTY:
                if (account.partyType === PartyType.CUSTOMER) return <User2 size={size} className="text-indigo-500" />;
                if (account.partyType === PartyType.SUPPLIER) return <Truck size={size} className="text-orange-500" />;
                if (account.partyType === PartyType.OTHER) return <Users size={size} className="text-slate-500" />;
                return <User2 size={size} className="text-indigo-500" />;

            case FinancialAccountType.CATEGORY:
                if (account.categoryType === CategoryType.INCOME) return <TrendingUp size={size} className="text-emerald-500" />;
                if (account.categoryType === CategoryType.EXPENSE) return <TrendingDown size={size} className="text-rose-500" />;
                if (account.categoryType === CategoryType.ASSET) return <Briefcase size={size} className="text-sky-500" />;
                if (account.categoryType === CategoryType.EQUITY) return <Scale size={size} className="text-violet-500" />;
                if (account.categoryType === CategoryType.ADJUSTMENT) return <Settings2 size={size} className="text-muted-foreground" />;
                return <Tag size={size} className="text-primary" />;

            default:
                return <Wallet size={size} className="text-primary" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={() => router.push(`/accounts/${account.id}` as any)}
            className="group relative p-5 rounded-[2rem] border-2 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-500">
                        {getIcon()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-black tracking-tight truncate">{account.name}</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 truncate">
                            {account.moneyType || account.partyType || account.categoryType || account.type}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className={`text-lg font-black tracking-tighter tabular-nums ${account.balance > 0 ? "text-emerald-500" : account.balance < 0 ? "text-rose-500" : ""}`}>
                        ₹{account.balance.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                    </p>
                    {!account.isSystem && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <AddAccountModal accountData={account}>
                                <div className="p-1.5 rounded-lg bg-muted/20 hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <Edit2 size={12} />
                                </div>
                            </AddAccountModal>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
