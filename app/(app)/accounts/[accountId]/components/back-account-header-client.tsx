"use client"

import { Pencil, Trash2, Check, X, ShieldAlert } from "lucide-react"
import { useState } from "react"
import { BackHeader } from "@/components/back-header"
import { deleteFinancialAccount } from "@/actions/financial-account.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddAccountModal } from "@/components/account/add-account-modal"
import { FinancialAccount } from "@/lib/generated/prisma/client"

export default function BackAccountHeaderClient({ account }: { account: FinancialAccount }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteFinancialAccount(account.id)
            toast.success("Account deleted successfully")
            router.push("/accounts" as any)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete account")
        }
    }

    return (
        <>
            <BackHeader
                title={account?.name}
                description={account?.moneyType || account?.categoryType || account?.type}
                backUrl={'/accounts' as any}
                menuItems={
                    account.isSystem ? [] : [
                        {
                            icon: <Pencil size={18} />,
                            label: "Edit",
                            onClick: () => setIsEditing(true),
                            destructive: false
                        },
                        {
                            icon: <Trash2 size={18} />,
                            label: "Delete",
                            onClick: () => setIsDeleting(true),
                            destructive: true
                        }
                    ]
                }
            />

            {/* Edit Modal (Reusing existing AddAccountModal for editing) */}
            {isEditing && (
                <AddAccountModal
                    accountData={account}
                    openInternal={isEditing}
                    setOpenInternal={setIsEditing}
                >
                    <div className="hidden" />
                </AddAccountModal>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent className="rounded-3xl border-rose-200">
                    <AlertDialogHeader>
                        <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
                            <ShieldAlert size={32} />
                        </div>
                        <AlertDialogTitle className="text-center text-2xl font-black">Dangerous Territory!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            This will delete <span className="font-bold text-foreground">"{account?.name}"</span>.
                            Accounts with transaction history cannot be deleted. This is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                        <AlertDialogCancel className="h-12 rounded-2xl font-bold border-none bg-muted">No, Keep It</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="h-12 rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
                        >
                            Yes, Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
