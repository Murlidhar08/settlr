"use client"

import { useMemo } from "react"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts"
import { motion } from "framer-motion"
import { Currency } from "@/lib/generated/prisma/enums"
import { formatAmount } from "@/utility/transaction"
import { t } from "@/lib/languages/i18n"

interface DistributionData {
    name: string
    value: number
}

interface AccountsDistributionClientProps {
    data: DistributionData[]
    currency: Currency
    language: string
}

const COLORS = [
    'oklch(0.606 0.25 292.717)', // primary
    'oklch(0.696 0.17 162.48)',  // emerald
    'oklch(0.645 0.246 16.439)', // rose
    'oklch(0.828 0.189 84.429)', // gold-ish
    'oklch(0.488 0.243 264.376)', // blue
]

export function AccountsDistributionClient({ data, currency, language }: AccountsDistributionClientProps) {
    const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-[2.5rem] border border-border/40 bg-card/30 p-8 shadow-sm backdrop-blur-md"
        >
            <div className="mb-6 space-y-1">
                <h3 className="text-xl font-black tracking-tight">{t("dashboard.balance_overview", language)}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Distribution across accounts</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[250px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const entry = payload[0].payload as DistributionData
                                        const percentage = ((entry.value / total) * 100).toFixed(1)
                                        return (
                                            <div className="rounded-xl border border-border/50 bg-background/90 p-3 shadow-xl backdrop-blur-md">
                                                <p className="text-xs font-black">{entry.name}</p>
                                                <p className="text-sm font-black text-primary">{formatAmount(entry.value, currency)}</p>
                                                <p className="text-[10px] font-bold opacity-60">{percentage}% of total</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-3 w-3 rounded-full transition-transform group-hover:scale-125"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-xs font-bold opacity-80">{item.name}</span>
                            </div>
                            <span className="text-xs font-black">{formatAmount(item.value, currency)}</span>
                        </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-border/40 flex justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Balance</span>
                        <span className="text-sm font-black text-primary">{formatAmount(total, currency)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
