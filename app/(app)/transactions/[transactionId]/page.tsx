import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDetailView } from "./components/transaction-detail-view"
import { getUserConfig } from "@/lib/user-config"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"
import { getTransactionPerspective } from "@/lib/transaction-logic"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"

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
      party: { select: { id: true, name: true } },
      toAccount: { select: { type: true } },
      fromAccount: { select: { type: true } }
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

  return <TransactionDetailView transaction={JSON.parse(JSON.stringify(transaction))} isIn={isIn} currency={currency} />
}
