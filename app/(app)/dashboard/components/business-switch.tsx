"use client"

import { Building2, Check, ChevronDown, Settings2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getBusinessList,
  switchBusiness,
} from "@/actions/business.actions"
import { authClient } from "@/lib/auth-client"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { t } from "@/lib/languages/i18n"

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
  const { language } = useUserConfig()
  const router = useRouter()
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [popOpen, setPopOpen] = useState(false)

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
        sessionRes.data?.user?.activeBusinessId

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
    router.refresh()
  }

  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

  return (
    <>
      <Popover open={popOpen} onOpenChange={setPopOpen}>
        <PopoverTrigger className="group flex min-w-0 items-center gap-2">
          <span className="text-muted-foreground hidden sm:inline">{t("business.label", language)} -</span>

          <span className="truncate text-xl font-semibold tracking-tight">
            {selectedBusiness?.name ?? "..."}
          </span>

          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 rounded-2xl p-2 shadow-xl">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-1"
            >
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {t("business.switch", language)}
              </div>

              {businesses.map(business => {
                const isActive = business.id === selectedBusiness?.id

                return (
                  <button
                    key={business.id}
                    onClick={() => onChangeBusinessId(business)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
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
                className="w-full justify-start gap-2 rounded-xl text-sm font-medium hover:bg-muted"
                onClick={() => {
                  router.push("/business" as any)
                }}
              >
                <Settings2 className="h-4 w-4" />
                {t("business.manage", language)}
              </Button>
            </motion.div>
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </>
  )
}

