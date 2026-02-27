import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { getUserConfig } from "@/lib/user-config"
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns"
import { CashflowChartClient } from "./cashflow-chart-client"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"

export async function CashflowChart() {
    const session = await getUserSession()
    const { currency, language } = await getUserConfig()
    const businessId = session?.user.activeBusinessId

    if (!businessId) return null

    const endDate = new Date()
    const startDate = subDays(startOfDay(endDate), 14) // Last 15 days

    const transactions = await prisma.transaction.findMany({
        where: {
            businessId,
            date: { gte: startDate }
        },
        select: {
            amount: true,
            date: true,
            toAccount: { select: { type: true } },
            fromAccount: { select: { type: true } }
        }
    })

    // Process data for the chart
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const chartData = days.map(day => {
        const dayStart = startOfDay(day)
        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const dayTransactions = transactions.filter(tx =>
            tx.date >= dayStart && tx.date <= dayEnd
        )

        let income = 0
        let expense = 0

        dayTransactions.forEach(t => {
            const amount = Number(t.amount)
            if (t.toAccount.type === FinancialAccountType.MONEY && t.fromAccount.type !== FinancialAccountType.MONEY) {
                income += amount
            } else if (t.fromAccount.type === FinancialAccountType.MONEY && t.toAccount.type !== FinancialAccountType.MONEY) {
                expense += amount
            }
        })

        return {
            date: format(day, 'MMM dd'),
            income,
            expense,
            net: income - expense
        }
    })

    return <CashflowChartClient data={chartData} currency={currency} language={language} />
}
