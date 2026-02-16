import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDetailView } from "./components/transaction-detail-view"
import { getUserConfig } from "@/lib/user-config"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const transactionId = (await params).transactionId;
  const session = await getUserSession()

  if (!session?.user.activeBusinessId)
    notFound()

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.user.activeBusinessId,
    },
    include: {
      party: { select: { id: true, name: true } },
      toAccount: { select: { type: true } },
      fromAccount: { select: { type: true } }
    },
  })

  if (!transaction)
    notFound()

  const isIn = (transaction.toAccount as any).type === FinancialAccountType.MONEY
  const { currency } = await getUserConfig()

  return <TransactionDetailView transaction={JSON.parse(JSON.stringify(transaction))} isIn={isIn} currency={currency} />
}
