"use client"

import { Wallet, Banknote, Landmark, CreditCard, Edit2, User2, TrendingUp, TrendingDown, Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialAccount } from "@/lib/generated/prisma/client"
import { MoneyType, FinancialAccountType, CategoryType } from "@/lib/generated/prisma/enums"
import { AddAccountModal } from "./add-account-modal"
import { motion } from "framer-motion"

interface AccountCardProps {
    account: FinancialAccount
    index: number
}

export const AccountCard = ({ account, index }: AccountCardProps) => {
    const getIcon = () => {
        switch (account.type) {
            case FinancialAccountType.MONEY:
                if (account.moneyType === MoneyType.CASH) return <Banknote size={24} className="text-emerald-500" />;
                if (account.moneyType === MoneyType.ONLINE) return <Landmark size={24} className="text-blue-500" />;
                if (account.moneyType === MoneyType.CHEQUE) return <CreditCard size={24} className="text-amber-500" />;
                return <Wallet size={24} className="text-primary" />;
            case FinancialAccountType.PARTY:
                return <User2 size={24} className="text-indigo-500" />;
            case FinancialAccountType.CATEGORY:
                if (account.categoryType === CategoryType.INCOME) return <TrendingUp size={24} className="text-emerald-500" />;
                if (account.categoryType === CategoryType.EXPENSE) return <TrendingDown size={24} className="text-rose-500" />;
                return <Tag size={24} className="text-primary" />;
            default:
                return <Wallet size={24} className="text-primary" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative p-6 rounded-3xl border-2 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-500">
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight">{account.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {account.moneyType || account.partyType || account.categoryType || account.type}
                        </p>
                    </div>
                </div>

                <AddAccountModal accountData={account}>
                    <div className="p-2 rounded-xl bg-muted/20 hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <Edit2 size={14} />
                    </div>
                </AddAccountModal>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
