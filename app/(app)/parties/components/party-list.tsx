"use client";

import { PartyType } from "@/lib/generated/prisma/enums";
import { tran } from "@/lib/languages/i18n";
import { useParties } from "@/tanstacks/parties";
import { AnimatePresence, motion } from "framer-motion";
import { PartyItem } from "./party-item";

interface PartyListProp {
  partyType: PartyType
  search?: string
  includeInactive?: boolean
  period?: 'month' | 'year' | 'all'
}

const PartyList = ({ partyType, search = "", includeInactive = false, period = 'all' }: PartyListProp) => {
  const { data: partyLst, isLoading: loading } = useParties(partyType, search, includeInactive, period);

  if (loading && !partyLst) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {partyLst?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <PartyItem
              id={item.id}
              name={item.name}
              subtitle={item.contactNo || tran("parties.no_contact")}
              amount={item.amount}
              avatarUrl={item.profileUrl || undefined}
              isActive={item.isActive}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!loading && !partyLst?.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-4"
        >
          <div className="relative">
            <div className="h-24 w-24 bg-muted/30 rounded-full flex items-center justify-center text-5xl">🔭</div>
            <div className="absolute -top-1 -right-1 h-8 w-8 bg-background rounded-full flex items-center justify-center shadow-sm border border-border/50">
              <span className="text-sm">❓</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4 uppercase">
              {tran("parties.no_parties_found", { type: partyType.toLowerCase() })}
            </h3>
            <p className="text-sm font-medium text-muted-foreground/60 max-w-62.5 mx-auto leading-relaxed uppercase tracking-wider text-[10px]">
              {tran("parties.no_results_search")}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export { PartyList };

