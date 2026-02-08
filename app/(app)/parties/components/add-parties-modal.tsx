"use client"

import { Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"

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
        : "Add New Party")

  const handleAddParty = async () => {
    if (!data.name.trim()) {
      return toast.error("Party name is required")
    }

    const success = await addParties(data)

    if (success) {
      toast.success("Party added successfully")
      setData({
        type,
        name: "",
        contactNo: null,
      })
      setOpen(false)
    }
  }

  return (
    <>
      {/* Floating CTA */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="inline-block cursor-pointer"
      >
        {children}
      </motion.div>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col p-0 pb-[env(safe-area-inset-bottom)] border-l border-border/40 bg-background/95 backdrop-blur-xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-5 bg-background/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-tight">{resolvedTitle}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Directory Entry</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-10 w-10 rounded-xl hover:bg-secondary/80"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* BODY */}
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Full Name / Business Title
              </Label>
              <Input
                placeholder="Ex. Reliance Industries Ltd"
                value={data.name}
                onChange={(e) =>
                  setData((pre) => ({ ...pre, name: e.target.value }))
                }
                className="h-14 rounded-2xl bg-secondary/30 border-secondary/50 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-base font-bold"
                autoFocus
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
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
                className="h-14 rounded-2xl bg-secondary/30 border-secondary/50 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-base font-bold"
              />
            </motion.div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 border-t border-border/40 bg-background/50 backdrop-blur-md p-6">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-2xl text-sm font-black uppercase tracking-widest border-border hover:bg-secondary/80"
                onClick={() => setOpen(false)}
              >
                Discard
              </Button>

              <Button
                onClick={handleAddParty}
                className="h-14 flex-[1.5] rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all font-black uppercase tracking-widest text-sm"
              >
                Create {type === PartyType.CUSTOMER ? "Customer" : "Supplier"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export { AddPartiesModal }
