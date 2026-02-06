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

export default function BalanceCard({ promise, currency }: BalanceCardProps) {
    const parties = use(promise);

    // Calculated
    const totalAmountRaw = parties.reduce((sum, party) => sum + party.amount, 0);
    const totalAmount = Number(totalAmountRaw.toFixed(3));

    const isCollect = totalAmount > 0;
    const isPay = totalAmount < 0;
    const isSettled = totalAmount === 0;

    // Label
    const label = isSettled ? "Settled"
        : isCollect
            ? "To Collect"
            : "To Pay";

    // Symbol
    const ArrowIcon = isCollect ? ArrowDown : ArrowUp;

    return (
        <section>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
                Total Balance
            </p>

            <div className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${isCollect ? "bg-emerald-50"
                : isPay ? "bg-rose-50" : "bg-muted"}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${isCollect
                        ? "bg-emerald-100 text-emerald-600"
                        : isPay
                            ? "bg-rose-100 text-rose-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                        {!isSettled && <ArrowIcon className="size-4" />}
                    </div>

                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {label}
                        </p>

                        <p
                            className={`text-xl font-bold ${isCollect
                                ? "text-emerald-700"
                                : isPay
                                    ? "text-rose-600"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {formatAmount(totalAmount, currency)}
                        </p>
                    </div>
                </div>

                <ChevronRight
                    className={
                        isCollect
                            ? "text-emerald-400"
                            : isPay
                                ? "text-rose-400"
                                : "text-muted-foreground"
                    }
                />
            </div>
        </section>
    );
}

