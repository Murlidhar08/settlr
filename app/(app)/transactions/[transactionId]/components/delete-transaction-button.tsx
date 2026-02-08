"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/lib/generated/prisma/client"
import { useConfirm } from "@/components/providers/confirm-provider"
import { deleteTransaction } from "@/actions/transaction.actions"

interface DeleteProp {
  transaction: Transaction
}

export function DeleteTransactionButton({ transaction }: DeleteProp) {
  const confirm = useConfirm()

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete transaction?",
      description: "This action cannot be undone.",
      confirmText: "Yes, delete",
      destructive: true,
    })

    if (!ok) return

    await deleteTransaction(
      transaction.id,
      transaction.partyId || ""
    )
  }

  return (
    <Button
      onClick={onDelete}
      variant="outline"
      size="lg"
      className="px-12 h-14 rounded-full gap-3 font-semibold uppercase text-red-600 border-red-200"
    >
      <Trash2 className="h-5 w-5" />
      Delete
    </Button>
  )
}
