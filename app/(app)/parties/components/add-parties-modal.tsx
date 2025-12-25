"use client"

import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ========================================================= */
/* TYPES */
/* ========================================================= */
import { addParties } from "@/actions/parties.actions"
import { PartyType } from "@/lib/generated/prisma/enums"
import { Party } from "@/lib/generated/prisma/client"

interface ParitesProps {
  title: string,
  type: PartyType
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const AddPartiesModal = ({ title, type }: ParitesProps) => {
  const [popOpen, setPopOpen] = useState(false);
  const [data, setData] = useState<Party>({
    type: type,
    name: "",
    businessId: "",
    contactNo: null,
    profileUrl: null
  })

  const handleAddBusiness = async () => {
    await addParties(data);
    setPopOpen(false)
  }

  return (
    <>
      <Sheet open={popOpen} onOpenChange={setPopOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
        >
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}
          <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b bg-background px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
          </SheetHeader>

          {/* ================================================== */}
          {/* BODY */}
          {/* ================================================== */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {/* Party Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Party name</Label>
              <Input
                id="name"
                placeholder="Party name"
                value={data.name}
                onChange={e => { setData(pre => ({ ...pre, name: e.target.value })) }}
                autoFocus
              />
            </div>

            {/* Party Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Contact No</Label>
              <Input
                id="conatactNo"
                placeholder="Contact No"
                value={data.contactNo || ""}
                onChange={e => { setData(pre => ({ ...pre, contactNo: e.target.value })) }}
              />
            </div>
          </div>

          {/* ================================================== */}
          {/* FOOTER */}
          {/* ================================================== */}
          <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPopOpen(false)} // PENDING
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddBusiness}
                className="flex-1"
                disabled={false} // PENDING
              >
                Add {type == PartyType.CUSTOMER
                  ? "Customer"
                  : type == PartyType.SUPPLIER
                    ? "Supplier"
                    : "Party"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Button
        onClick={() => { setPopOpen(true) }}
        size="icon"
        className="fixed bottom-24 right-6 z-30 h-16 w-16 rounded-full bg-green-800"
      >
        <Plus className="size-7" />
      </Button>
    </>
  )
}

export { AddPartiesModal }
