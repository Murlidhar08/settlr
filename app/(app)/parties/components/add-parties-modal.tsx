"use client"

import { Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/* ========================================================= */
/* ACTIONS + TYPES */
/* ========================================================= */
import { addParties } from "@/actions/parties.actions"
import { PartyType } from "@/lib/generated/prisma/enums"
import { PartyInput } from "@/types/party/PartyRes"

interface PartiesProps {
  title?: string
  type: PartyType
  children: ReactNode
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const AddPartiesModal = ({ title, type, children }: PartiesProps) => {
  const [open, setOpen] = useState(false)

  const [data, setData] = useState<PartyInput>({
    type,
    name: "",
    contactNo: null,
  })

  const resolvedTitle =
    title ??
    (type === PartyType.CUSTOMER
      ? "Add New Customer"
      : type === PartyType.SUPPLIER
        ? "Add New Supplier"
        : type === PartyType.EMPLOYEE
          ? "Add New Employee"
          : "Add New Party")

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addParties,
    onMutate: async (newParty) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["parties", type] })

      // Snapshot the previous value
      const previousParties = queryClient.getQueryData(["parties", type, ""])

      // Optimistically update to the new value
      queryClient.setQueryData(["parties", type, ""], (old: any) => [
        {
          ...newParty,
          id: `temp-${Date.now()}`,
          amount: 0,
          profileUrl: null,
        },
        ...(old || []),
      ])

      // Return a context object with the snapshotted value
      return { previousParties }
    },
    onError: (err, newParty, context) => {
      queryClient.setQueryData(["parties", type, ""], context?.previousParties)
      toast.error("Failed to add party")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["parties", type] })
    },
    onSuccess: () => {
      toast.success("Party added successfully")
      setData({
        type,
        name: "",
        contactNo: null,
      })
      setOpen(false)
    }
  })

  const handleAddParty = async () => {
    if (!data.name.trim()) {
      return toast.error("Party name is required")
    }

    mutation.mutate(data)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer active:scale-95 transition-transform">
        {children}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full! h-full! sm:max-w-[70vw]! lg:max-w-[35vw]! border-l-0 sm:border-l p-0 flex flex-col overflow-hidden bg-background"
        >
          {/* HEADER */}
          <div className="px-6 py-6 border-b bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20 border border-primary/20">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-tight">{resolvedTitle}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Directory Entry</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-6 py-8 space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                  Full Name / Business Title
                </Label>
                <Input
                  placeholder="Ex. Reliance Industries Ltd"
                  value={data.name}
                  onChange={(e) =>
                    setData((pre) => ({ ...pre, name: e.target.value }))
                  }
                  className="h-14 rounded-2xl border-2 bg-transparent px-4 text-base font-bold shadow-sm outline-none focus:border-primary transition-all"
                  autoFocus
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                  Primary Contact Number
                </Label>
                <Input
                  placeholder="+91 00000 00000 (Optional)"
                  inputMode="numeric"
                  value={data.contactNo ?? ""}
                  onChange={(e) =>
                    setData((pre) => ({
                      ...pre,
                      contactNo: e.target.value || null,
                    }))
                  }
                  className="h-14 rounded-2xl border-2 bg-transparent px-4 text-base font-bold shadow-sm outline-none focus:border-primary transition-all"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t bg-background/50 backdrop-blur-md pb-[env(safe-area-inset-bottom,24px)]">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-2xl text-base font-bold border-2"
                onClick={() => setOpen(false)}
              >
                Discard
              </Button>

              <Button
                onClick={handleAddParty}
                className="h-14 flex-[1.5] rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 active:scale-[0.97] transition-all font-black uppercase tracking-widest text-base"
              >
                Create {type === PartyType.CUSTOMER ? "Customer" :
                  type === PartyType.SUPPLIER ? "Supplier" :
                    type === PartyType.EMPLOYEE ? "Employee" :
                      "Party"}
              </Button>
            </div>
          </div>
        </SheetContent>

      </Sheet>
    </>
  )
}

export { AddPartiesModal }
