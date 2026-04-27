"use client"

import {
  switchBusiness
} from "@/actions/business.actions"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { Button } from "@/components/ui/button"
import LoadingText from "@/components/ui/loading-text"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getSession, useSession } from "@/lib/auth/auth-client"
import { t } from "@/lib/languages/i18n"
import { cn } from "@/lib/utils"
import { useBusinessList } from "@/tanstacks/business"
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
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const { data: businesses, isLoading: isBusinessesLoading } = useBusinessList();
  const { data: session, isPending: isSessionLoading } = useSession();
  const activeBusinessId = session?.user?.activeBusinessId;
  const selectedBusiness = businesses?.find((b: Business) => b.id === activeBusinessId) ?? businesses?.[0];
  const isLoading = isBusinessesLoading || isSessionLoading || isSwitching;

  /* ========================================================= */
  /* HANDLERS */
  /* ========================================================= */
  const onChangeBusinessId = async (business: Business) => {
    if (business.id === selectedBusiness?.id) {
      setPopOpen(false);
      return;
    }

    setIsSwitching(true);
    setSwitchingId(business.id);
    try {
      await switchBusiness(business.id);
      await getSession();
      // Direct effect: force a full reload and redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to switch business:", error);
      setIsSwitching(false);
      setSwitchingId(null);
    }
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
              {businesses?.map((business: Business) => {
                const isActive = business.id === selectedBusiness?.id

                return (
                  <button
                    key={business.id}
                    disabled={isSwitching}
                    onClick={() => onChangeBusinessId(business)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted",
                      isSwitching && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {switchingId === business.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Building2 className="h-4 w-4 shrink-0" />
                    )}

                    <span className="flex-1 truncate text-left">
                      {business.name}
                    </span>

                    {isActive && !isSwitching && <Check className="h-4 w-4" />}
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

