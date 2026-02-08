import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDirection } from "@/lib/generated/prisma/enums"
import { TransactionDetailView } from "./components/transaction-detail-view"

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const transactionId = (await params).transactionId;
  const session = await getUserSession()

  if (!session?.session.activeBusinessId)
    notFound()

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.session.activeBusinessId,
    },
    include: {
      party: { select: { id: true, name: true } },
    },
  })

  if (!transaction)
    notFound()

  const isIn = transaction.direction === TransactionDirection.IN

  return <TransactionDetailView transaction={JSON.parse(JSON.stringify(transaction))} isIn={isIn} />
}
