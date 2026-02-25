"use client";

import { use } from "react";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";

import { Currency } from "@/lib/generated/prisma/enums";
import { formatAmount } from "@/utility/transaction";
import { PartyRes } from "@/types/party/PartyRes";

interface BalanceCardProps {
    promise: Promise<PartyRes[]>,
    currency: Currency
}

import { motion } from "framer-motion";

export default function BalanceCard({ promise, currency }: BalanceCardProps) {
    const parties = use(promise);

    const totalAmountRaw = parties.reduce((sum, party) => sum + party.amount, 0);
    const totalAmount = Number(totalAmountRaw.toFixed(3));

    const isCollect = totalAmount > 0;
    const isPay = totalAmount < 0;
    const isSettled = totalAmount === 0;

    const label = isSettled ? "Settled"
        : isCollect
            ? "To Collect"
            : "To Pay";

    const ArrowIcon = isCollect ? ArrowDown : ArrowUp;

    return (
        <section>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Total Balance
            </p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group flex items-center justify-between rounded-3xl border-2 p-6 transition-all duration-500 shadow-sm ${isCollect
                    ? "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/20"
                    : isPay
                        ? "bg-rose-50/50 border-rose-100 shadow-rose-100/20"
                        : "bg-muted/30 border-muted"
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`rounded-2xl p-3 transition-transform duration-500 group-hover:rotate-12 ${isCollect
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : isPay
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}>
                        {!isSettled ? <ArrowIcon className="size-5" /> : <ChevronRight className="size-5" />}
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                            {label}
                        </p>

                        <p className={`text-3xl font-black tabular-nums transition-colors duration-500 ${isCollect
                            ? "text-emerald-700"
                            : isPay
                                ? "text-rose-700"
                                : "text-muted-foreground"
                            }`}>
                            {formatAmount(Math.abs(totalAmount), currency)}
                        </p>
                    </div>
                </div>

                <div className={`p-2 rounded-xl transition-colors ${isCollect ? "bg-emerald-100/50 text-emerald-600" : isPay ? "bg-rose-100/50 text-rose-600" : "bg-muted/50 text-muted-foreground"
                    }`}>
                    <ChevronRight className="size-5" />
                </div>
            </motion.div>
        </section>
    );
}