"use client"

import { useMemo } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from "recharts"
import { motion } from "framer-motion"
import { Currency } from "@/lib/generated/prisma/enums"
import { formatAmount } from "@/utility/transaction"
import { t } from "@/lib/languages/i18n"
import { cn } from "@/lib/utils"

interface ChartData {
    date: string
    income: number
    expense: number
    net: number
}

interface CashflowChartClientProps {
    data: ChartData[]
    currency: Currency
    language: string
}

const CustomTooltip = ({ active, payload, label, currency }: TooltipProps<number, string> & { currency: Currency }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-border/50 bg-background/90 p-4 shadow-2xl backdrop-blur-xl">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-8">
                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Inflow
                        </span>
                        <span className="text-xs font-black">{formatAmount(payload[0].value || 0, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                        <span className="flex items-center gap-2 text-xs font-bold text-rose-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Outflow
                        </span>
                        <span className="text-xs font-black">{formatAmount(payload[1].value || 0, currency)}</span>
                    </div>
                    <div className="my-2 h-px bg-border/40" />
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-xs font-bold opacity-70">Net Flow</span>
                        <span className={cn(
                            "text-sm font-black",
                            (payload[2]?.value || 0) >= 0 ? "text-primary" : "text-rose-500"
                        )}>
                            {formatAmount(payload[2]?.value || 0, currency)}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export function CashflowChartClient({ data, currency, language }: CashflowChartClientProps) {
    const chartData = useMemo(() => data, [data])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-[2.5rem] border border-border/40 bg-card/30 p-6 shadow-sm backdrop-blur-md"
        >
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight">{t("dashboard.cashflow_trend", language)}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Last 15 Days</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Inflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Outflow</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.645 0.246 16.439)" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="oklch(0.645 0.246 16.439)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="oklch(var(--border) / 0.1)"
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.4 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            content={<CustomTooltip currency={currency} />}
                            cursor={{ stroke: 'oklch(var(--primary) / 0.2)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="oklch(0.696 0.17 162.48)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="oklch(0.645 0.246 16.439)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                        />
                        <Area
                            type="monotone"
                            dataKey="net"
                            stroke="transparent"
                            fill="transparent"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}
