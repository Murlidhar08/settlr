import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { getUserConfig } from "@/lib/user-config"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"
import { AccountsDistributionClient } from "./accounts-distribution-client"

export async function AccountsDistribution() {
    const session = await getUserSession()
    const { currency, language } = await getUserConfig()
    const businessId = session?.user.activeBusinessId

    if (!businessId) return null

    // 1. Fetch money accounts
    const accounts = await prisma.financialAccount.findMany({
        where: { businessId, type: FinancialAccountType.MONEY },
        select: { id: true, name: true }
    });

    if (accounts.length === 0) return null

    const accountIds = accounts.map(a => a.id)

    // 2. Fetch all transactions for these accounts to calculate balances
    const transactions = await prisma.transaction.findMany({
        where: {
            businessId,
            OR: [
                { fromAccountId: { in: accountIds } },
                { toAccountId: { in: accountIds } }
            ]
        },
        select: {
            amount: true,
            fromAccountId: true,
            toAccountId: true
        }
    })

    const distributionData = accounts.map(acc => {
        let balance = 0
        transactions.forEach(tx => {
            const amount = Number(tx.amount)
            if (tx.toAccountId === acc.id) balance += amount
            if (tx.fromAccountId === acc.id) balance -= amount
        })

        return {
            name: acc.name,
            value: Math.max(0, balance) // Only show positive balances in the pie
        }
    }).filter(a => a.value > 0)

    if (distributionData.length === 0) return null

    return <AccountsDistributionClient data={distributionData} currency={currency} language={language} />
}
