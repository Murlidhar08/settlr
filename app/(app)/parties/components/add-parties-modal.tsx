"use client"

import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [open, setOpen] = useState(false)

  const [data, setData] = useState<PartyInput>({
    type,
    name: "",
    contactNo: null,
  })

  const resolvedTitle =
    title ??
    (type === PartyType.CUSTOMER
      ? "Add Customer"
      : type === PartyType.SUPPLIER
        ? "Add Supplier"
        : "Add Party")

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
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-screen! max-w-none! h-screen sm:w-full! sm:max-w-md! sm:h-full flex flex-col p-0 pb-[env(safe-area-inset-bottom)]"
        >
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}
          <div className="flex items-center gap-3 border-b px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold">{resolvedTitle}</h2>
          </div>

          {/* ================================================== */}
          {/* BODY */}
          {/* ================================================== */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
            {/* Party Name */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                PARTY NAME
              </Label>
              <Input
                placeholder="Enter name"
                value={data.name}
                onChange={(e) =>
                  setData((pre) => ({ ...pre, name: e.target.value }))
                }
                className="h-12 rounded-xl"
                autoFocus
              />
            </div>

            {/* Contact No */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                CONTACT NUMBER
              </Label>
              <Input
                placeholder="Optional"
                inputMode="numeric"
                value={data.contactNo ?? ""}
                onChange={(e) =>
                  setData((pre) => ({
                    ...pre,
                    contactNo: e.target.value || null,
                  }))
                }
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* ================================================== */}
          {/* FOOTER */}
          {/* ================================================== */}
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl text-base"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddParty}
                className="h-12 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-semibold"
              >
                Add {type === PartyType.CUSTOMER ? "Customer" : "Supplier"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export { AddPartiesModal }
