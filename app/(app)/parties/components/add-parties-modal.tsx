"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { tran } from "@/lib/languages/i18n"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Loader2, Users, Truck, Briefcase, CircleDot, CheckCircle2, Edit2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

/* ========================================================= */
/* ACTIONS + TYPES */
/* ========================================================= */
import { addParties, updateParty } from "@/actions/parties.actions"
import { PartyType } from "@/lib/generated/prisma/enums"
import { PartyInput } from "@/types/party/PartyRes"

interface PartiesProps {
  title?: string
  type: PartyType
  partyData?: {
    id: string
    name: string
    contactNo?: string | null
    type: PartyType
  }
  children?: ReactNode
  openInternal?: boolean
  setOpenInternal?: (open: boolean) => void
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const AddPartiesModal = ({
  title,
  type,
  partyData,
  children,
  openInternal,
  setOpenInternal,
}: PartiesProps) => {
  const router = useRouter()
  const [openState, setOpenState] = useState(false)
  const open = openInternal !== undefined ? openInternal : openState
  const setOpen = (val: boolean) => {
    if (setOpenInternal) setOpenInternal(val)
    else setOpenState(val)
  }
  const queryClient = useQueryClient()

  const [data, setData] = useState<PartyInput>({
    type,
    name: "",
    contactNo: null,
  })

  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (open) {
      if (partyData) {
        setData({
          name: partyData.name,
          type: partyData.type || type,
          contactNo: partyData.contactNo || null,
        })
      } else {
        setData({
          name: "",
          type: type,
          contactNo: null,
        })
      }
    }
  }, [open, partyData, type])

  const handleSave = async () => {
    if (!data.name.trim()) {
      return toast.error(tran("parties.msg.name_required"))
    }

    setIsPending(true)
    try {
      if (partyData) {
        const success = await updateParty(partyData.id, data)
        if (success) {
          toast.success(tran("parties.msg.updated") || "Party updated successfully", {
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          })
          queryClient.invalidateQueries({ queryKey: ["party-list"] })
          queryClient.invalidateQueries({ queryKey: ["party-detail", partyData.id] })
          setOpen(false)
          router.refresh()
        } else {
          toast.error(tran("parties.msg.update_failed") || "Failed to update party")
        }
      } else {
        const success = await addParties(data)
        if (success) {
          toast.success(tran("parties.msg.added"), {
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          })
          queryClient.invalidateQueries({ queryKey: ["party-list"] })
          setData({
            type,
            name: "",
            contactNo: null,
          })
          setOpen(false)
          router.refresh()
        } else {
          toast.error(tran("parties.msg.add_failed"))
        }
      }
    } catch (error) {
      toast.error("Failed to save party")
    } finally {
      setIsPending(false)
    }
  }

  const resolvedTitle =
    title ??
    (partyData
      ? "Edit Party"
      : (type === PartyType.CUSTOMER
        ? tran("parties.add_new_customer")
        : type === PartyType.SUPPLIER
          ? tran("parties.add_new_supplier")
          : type === PartyType.EMPLOYEE
            ? tran("parties.add_new_employee")
            : tran("parties.add_new_party")))

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
      {children && (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer active:scale-95 transition-transform">
          {children}
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full! h-full! sm:max-w-[70vw]! lg:max-w-[35vw]! border-l-0 sm:border-l p-0 flex flex-col overflow-hidden bg-background"
        >
          {/* HEADER */}
          <div className="px-6 py-6 border-b bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20 border border-primary/20">
                {partyData ? <Edit2 size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-tight">{resolvedTitle}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                  {partyData ? "Modify Existing Party" : tran("parties.directory_entry")}
                </p>
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
              {/* Full Name */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                  {tran("parties.full_name_business")}
                </Label>
                <Input
                  placeholder={tran("parties.reliance_placeholder")}
                  value={data.name}
                  onChange={(e) =>
                    setData((pre: PartyInput) => ({ ...pre, name: e.target.value }))
                  }
                  className="h-14 rounded-2xl border-2 bg-transparent px-4 text-base font-bold shadow-sm outline-none focus:border-primary transition-all"
                  autoFocus
                />
              </motion.div>

              {/* Primary Contact */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                  {tran("parties.primary_contact")}
                </Label>
                <Input
                  placeholder={tran("parties.phone_placeholder")}
                  inputMode="numeric"
                  value={data.contactNo ?? ""}
                  onChange={(e) =>
                    setData((pre: PartyInput) => ({
                      ...pre,
                      contactNo: e.target.value || null,
                    }))
                  }
                  className="h-14 rounded-2xl border-2 bg-transparent px-4 text-base font-bold shadow-sm outline-none focus:border-primary transition-all"
                />
              </motion.div>

              {/* Party Type Selection */}
              <motion.div variants={itemVariants} className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                  {tran("parties.directory_type") || "Directory Type"}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: PartyType.CUSTOMER, label: tran("parties.customers"), icon: Users },
                    { id: PartyType.SUPPLIER, label: tran("parties.suppliers"), icon: Truck },
                    { id: PartyType.EMPLOYEE, label: tran("parties.employees"), icon: Briefcase },
                    { id: PartyType.OTHER, label: tran("parties.other"), icon: CircleDot },
                  ].map((pType) => (
                    <button
                      key={pType.id}
                      type="button"
                      disabled={!partyData} // Disabled and readonly when adding
                      onClick={() => {
                        setData({
                          ...data,
                          type: pType.id
                        });
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 text-center",
                        data.type === pType.id
                          ? "bg-primary/5 border-primary text-primary shadow-sm font-black"
                          : "bg-background border-muted hover:border-primary/30 text-muted-foreground",
                        !partyData && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <pType.icon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{pType.label}</span>
                    </button>
                  ))}
                </div>
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
                {tran("parties.discard")}
              </Button>

              <Button
                onClick={handleSave}
                disabled={isPending}
                className="h-14 flex-[1.5] rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 active:scale-[0.97] transition-all font-black uppercase tracking-widest text-base gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {tran("parties.hang_on")}
                  </>
                ) : (
                  <>
                    {partyData ? (
                      "Save Changes"
                    ) : (
                      type === PartyType.CUSTOMER ? tran("parties.create_customer") :
                        type === PartyType.SUPPLIER ? tran("parties.create_supplier") :
                          type === PartyType.EMPLOYEE ? tran("parties.create_employee") :
                            tran("parties.create_party")
                    )}
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
