"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Building2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { toast } from "sonner"

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
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const [data, setData] = useState<PartyInput>({
    type,
    name: "",
    contactNo: null,
  })

  const partyMutation = useMutation({
    mutationFn: (partyData: PartyInput) => addParties(partyData),
    onMutate: async (newParty) => {
      // 1. Cancel refetches
      await queryClient.cancelQueries({ queryKey: ["party-list", type] })

      // 2. Snapshot
      const previousParties = queryClient.getQueriesData({ queryKey: ["party-list", type] })

      // 3. Optimistically update
      const tempId = "temp-" + Date.now();
      const optimisticParty = {
        ...newParty,
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Mocking structure if necessary...
      }

      queryClient.setQueriesData({ queryKey: ["party-list", type] }, (old: any) => {
        if (!old) return [optimisticParty];
        return [...old, optimisticParty];
      })

      return { previousParties }
    },
    onError: (err, newParty, context: any) => {
      if (context?.previousParties) {
        context.previousParties.forEach(([key, value]: any) => queryClient.setQueryData(key, value))
      }
      toast.error("Failed to add party")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["party-list", type] })
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] })
    }
  })

  const handleAddParty = async () => {
    if (!data.name.trim()) {
      return toast.error("Party name is required")
    }

    partyMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Party added successfully")
        queryClient.invalidateQueries({ queryKey: ["party-list", type] })
        setData({
          type,
          name: "",
          contactNo: null,
        })
        setOpen(false)
        router.refresh()
      }
    })
  }

  const resolvedTitle =
    title ??
    (type === PartyType.CUSTOMER
      ? "Add New Customer"
      : type === PartyType.SUPPLIER
        ? "Add New Supplier"
        : type === PartyType.EMPLOYEE
          ? "Add New Employee"
          : "Add New Party")

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
                disabled={partyMutation.isPending}
                className="h-14 flex-[1.5] rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 active:scale-[0.97] transition-all font-black uppercase tracking-widest text-base gap-2"
              >
                {partyMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Hang on...
                  </>
                ) : (
                  <>
                    Create {type === PartyType.CUSTOMER ? "Customer" :
                      type === PartyType.SUPPLIER ? "Supplier" :
                        type === PartyType.EMPLOYEE ? "Employee" :
                          "Party"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>

      </Sheet>
    </>
  )
}

export { AddPartiesModal }
