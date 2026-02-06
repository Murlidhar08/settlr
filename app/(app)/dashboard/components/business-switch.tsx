"use client"

import { Building2, Check, ChevronDown, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  addBusiness,
  getBusinessList,
  switchBusiness,
} from "@/actions/business.actions"
import { authClient } from "@/lib/auth-client"

/* ========================================================= */
/* TYPES */
/* ========================================================= */

interface Business {
  id: string
  name: string
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

export default function SwitchBusiness() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [popOpen, setPopOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [businessName, setBusinessName] = useState("")

  /* ========================================================= */
  /* INIT: LOAD BUSINESSES + SESSION */
  /* ========================================================= */

  useEffect(() => {
    const init = async () => {
      const [businessList, sessionRes] = await Promise.all([
        getBusinessList(),
        authClient.getSession(),
      ])

      const list = businessList as Business[]
      setBusinesses(list)

      if (!list.length) return

      const activeBusinessId =
        sessionRes.data?.session?.activeBusinessId

      const active =
        list.find(b => b.id === activeBusinessId) ?? list[0]

      setSelectedBusiness(active)

      // ensure backend/session is in sync
      await switchBusiness(active.id)
    }

    init()
  }, [])

  /* ========================================================= */
  /* HANDLERS */
  /* ========================================================= */

  const onChangeBusinessId = async (business: Business) => {
    setSelectedBusiness(business)
    await switchBusiness(business.id)
    setPopOpen(false)
  }

  const handleAddBusiness = async () => {
    if (!businessName.trim())
      return

    const newBusiness = await addBusiness(businessName)

    // re-fetch list for consistency
    const list = (await getBusinessList()) as Business[]
    setBusinesses(list)

    if (newBusiness?.id) {
      const active = list.find(b => b.id === newBusiness.id)
      if (active) {
        setSelectedBusiness(active)
        await switchBusiness(active.id)
      }
    }

    setBusinessName("")
    setOpen(false)
    setPopOpen(false)
  }

  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

  return (
    <>
      <Popover open={popOpen} onOpenChange={setPopOpen}>
        <PopoverTrigger className="group flex min-w-0 items-center gap-2">
          <span>Business -</span>

          <span className="truncate text-xl font-semibold tracking-tight">
            {selectedBusiness?.name ?? "Loading..."}
          </span>

          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 rounded-2xl p-2 shadow-xl">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-1"
            >
              {businesses.map(business => {
                const isActive = business.id === selectedBusiness?.id

                return (
                  <button
                    key={business.id}
                    onClick={() => onChangeBusinessId(business)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Building2 className="h-4 w-4 shrink-0" />

                    <span className="flex-1 truncate text-left">
                      {business.name}
                    </span>

                    {isActive && <Check className="h-4 w-4" />}
                  </button>
                )
              })}

              <div className="my-2 h-px bg-border" />

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-sm"
                onClick={() => {
                  setOpen(true)
                  setPopOpen(false)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Business
              </Button>
            </motion.div>
          </AnimatePresence>
        </PopoverContent>
      </Popover>

      {/* ===================================================== */}
      {/* ADD BUSINESS SHEET */}
      {/* ===================================================== */}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-md flex-col p-0"
        >
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Add Business</h2>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business name</Label>
              <Input
                id="name"
                placeholder="Business name"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <SheetFooter className="border-t px-6 py-4">
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={handleAddBusiness}
                disabled={!businessName.trim()}
              >
                Create Business
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
