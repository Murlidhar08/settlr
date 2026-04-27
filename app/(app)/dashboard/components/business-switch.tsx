"use client"

import {
  switchBusiness
} from "@/actions/business.actions"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { Button } from "@/components/ui/button"
import LoadingText from "@/components/ui/loading-text"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSession } from "@/lib/auth/auth-client"
import { t } from "@/lib/languages/i18n"
import { cn } from "@/lib/utils"
import { useBusinessList } from "@/tanstacks/dashboard"
import { AnimatePresence, motion } from "framer-motion"
import { Building2, Check, ChevronDown, Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
  const router = useRouter();
  const { language } = useUserConfig();
  const [popOpen, setPopOpen] = useState(false);
  const { data: businesses, isLoading: isBusinessesLoading } = useBusinessList();
  const { data: session, isPending: isSessionLoading } = useSession();
  const activeBusinessId = session?.user?.activeBusinessId;
  const selectedBusiness = businesses?.find((b) => b.id === activeBusinessId) ?? businesses?.[0];
  const isLoading = isBusinessesLoading || isSessionLoading;

  /* ========================================================= */
  /* HANDLERS */
  /* ========================================================= */
  const onChangeBusinessId = async (business: Business) => {
    // Optimistically update or just wait for revalidation
    await switchBusiness(business.id);
    setPopOpen(false);
    router.refresh();
  };

  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

  return (
    <>
      <Popover open={popOpen} onOpenChange={setPopOpen}>
        <PopoverTrigger className="group flex min-w-0 items-center gap-2 outline-hidden">
          <span className="text-muted-foreground hidden sm:inline">{t("business.label", language)} -</span>

          <span className="truncate text-xl font-semibold tracking-tight min-w-[100px]">
            <LoadingText value={selectedBusiness?.name} />
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
              {/* Loading Text */}
              {isLoading && (
                <LoadingText value={"Loading ..."} />
              )}

              {/* List of Businesses */}
              {businesses?.map(business => {
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

              {/* Divider */}
              <div className="my-2 h-px bg-border" />

              {/* Settings Button */}
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

