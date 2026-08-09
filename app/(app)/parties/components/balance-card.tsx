"use client";

import { PartyType } from "@/lib/generated/prisma/enums";
import { tran } from "@/lib/languages/i18n";
import { useParties } from "@/tanstacks/parties";
import { formatAmount } from "@/utility/transaction";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";

interface BalanceCardProps {
    partyType: PartyType;
    search?: string;
    includeInactive?: boolean;
    period?: 'month' | 'year' | 'all';
}

export default function BalanceCard({ partyType, search, includeInactive, period = 'all' }: BalanceCardProps) {
    const { data: parties, isLoading } = useParties(partyType, search, includeInactive, period);

    if (isLoading || !parties) {
        return <div className="h-28 w-full animate-pulse rounded-2xl bg-muted/20 border border-muted/30" />;
    }

    const totalAmountRaw = parties.reduce((sum, party) => sum + party.amount, 0);
    const totalAmount = Number(totalAmountRaw.toFixed(3));

    const isToPay = totalAmount > 0;
    const isToReceive = totalAmount < 0;
    const isSettled = totalAmount === 0;

    const label = isSettled
        ? tran("parties.settled")
        : isToReceive
            ? tran("parties.to_receive")
            : tran("parties.to_pay");

    const ArrowIcon = isToReceive ? ArrowDown : ArrowUp;

    return (
        <section>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {tran("parties.total_balance")}
            </p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group flex items-center justify-between rounded-3xl border-2 p-6 transition-all duration-500 shadow-sm ${isToReceive
                    ? "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/20"
                    : isToPay
                        ? "bg-rose-50/50 border-rose-100 shadow-rose-100/20"
                        : "bg-muted/30 border-muted"
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`rounded-2xl p-3 transition-transform duration-500 group-hover:rotate-12 ${isToReceive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : isToPay
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}>
                        {!isSettled ? <ArrowIcon className="size-5" /> : <ChevronRight className="size-5" />}
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                            {label}
                        </p>

                        <p className={`text-3xl font-black tabular-nums transition-colors duration-500 ${isToReceive
                            ? "text-emerald-700 dark:text-emerald-400"
                            : isToPay
                                ? "text-rose-700 dark:text-rose-400"
                                : "text-muted-foreground"
                            }`}>
                            {formatAmount(Math.abs(totalAmount))}
                        </p>
                    </div>
                </div>

                <div className={`p-2 rounded-xl transition-colors ${isToReceive ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : isToPay ? "bg-rose-100/50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" : "bg-muted/50 text-muted-foreground"
                    }`}>
                    <ChevronRight className="size-5" />
                </div>
            </motion.div>
        </section>
    );
}