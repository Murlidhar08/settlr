import { Building2, ChevronRight, LockKeyhole } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
// import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

interface PopupSheetProps {
  title?: string
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

export default async function SecurityModal({ }: PopupSheetProps) {
  const [accounts] = await Promise.all([
    auth.api.listUserAccounts({ headers: await headers() }),
  ])

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <LockKeyhole size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              Security
            </p>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </button>
      </SheetTrigger>

      <SheetContent
        side={"right"}
        className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Security Tab</h2>
          </div>
        </SheetHeader>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          Place content
        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}
        <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <div className="flex w-full gap-3">
            {/* Close button */}
            <SheetClose >
              <Button
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent >
    </Sheet >
  )
}
