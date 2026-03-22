import { getUserSession } from "@/lib/auth/auth"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"
import { prisma } from "@/lib/prisma/prisma"
import { getTransactionPerspective } from "@/lib/transaction-logic"
import { getUserConfig } from "@/lib/user-config"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
import { notFound } from "next/navigation"
import { TransactionDetailView } from "./components/transaction-detail-view"

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params;
  const session = await getUserSession()
  if (!session?.user.activeBusinessId)
    notFound()

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.user.activeBusinessId,
    },
    include: {
      party: { select: { id: true, name: true, contactNo: true } },
      toAccount: { select: { id: true, name: true, type: true, moneyType: true, categoryType: true } },
      fromAccount: { select: { id: true, name: true, type: true, moneyType: true, categoryType: true } },
      user: { select: { name: true } }
    },
  })

  if (!transaction)
    notFound()

  const { currency } = await getUserConfig()

  // Determine perspective: If party exists, use its account, else use toAccount if it's MONEY
  const contextId = transaction.toAccount.type === FinancialAccountType.MONEY
    ? transaction.toAccountId
    : transaction.fromAccountId;

  const perspective = getTransactionPerspective(
    transaction.toAccountId,
    transaction.fromAccountId,
    contextId
  );

  const isIn = perspective === TransactionDirection.IN;

  return (
    <TransactionDetailView
      transaction={JSON.parse(JSON.stringify(transaction))}
      isIn={isIn}
      currency={currency}
    />
  )
}
