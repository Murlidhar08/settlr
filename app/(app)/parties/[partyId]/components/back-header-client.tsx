"use client"

import { Pencil, Trash2, Building2, Check, X, ShieldAlert } from "lucide-react"
import { useState } from "react"
import { BackHeader } from "@/components/back-header"
import { updateParty, deleteParty } from "@/actions/parties.actions"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function BackHeaderClient({ party }: { party: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: party?.name || "",
    contactNo: party?.contactNo || "",
  })

  const handleDelete = async () => {
    const success = await deleteParty(party.id)
    if (success) {
      toast.success("Party and all transactions deleted")
      router.push("/parties" as any)
    } else {
      toast.error("Failed to delete party")
    }
  }

  const handleUpdate = async () => {
    if (!editData.name.trim()) {
      return toast.error("Name is required")
    }
    const success = await updateParty(party.id, {
      name: editData.name,
      contactNo: editData.contactNo || null
    })

    if (success) {
      toast.success("Party updated successfully")
      setIsEditing(false)
      router.refresh()
    } else {
      toast.error("Failed to update party")
    }
  }

  return (
    <>
      <BackHeader
        title={party?.name}
        description={party?.type}
        backUrl='/parties'
        menuItems={[
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
        ]}
      />

      {/* Edit Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <SheetTitle>Edit Party</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Party Name</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="h-12 text-lg font-bold rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Contact Number</Label>
              <Input
                value={editData.contactNo}
                onChange={(e) => setEditData({ ...editData, contactNo: e.target.value })}
                className="h-12 text-lg font-bold rounded-xl"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="border-t p-6 pb-[env(safe-area-inset-bottom)]">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="rounded-3xl border-rose-200">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
              <ShieldAlert size={32} />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-black">Dangerous Territory!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              This will delete <span className="font-bold text-foreground">"{party?.name}"</span> and <span className="font-bold text-rose-600 underline">EVERY single transaction</span> associated with them. This is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
            <AlertDialogCancel className="h-12 rounded-2xl font-bold border-none bg-muted">No, Keep Them</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
            >
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
