"use client";

// Packages
import { use } from "react";
import { PartyType } from "@/lib/generated/prisma/enums";

// componets
import { PartyItem } from "./party-item";

// Types
import { PartyRes } from "@/types/party/PartyRes";

interface PartyListProp {
  partyType: PartyType
  promise: Promise<PartyRes[]>
}

import { motion, AnimatePresence } from "framer-motion";

const PartyList = ({ partyType, promise }: PartyListProp) => {
  const partyLst = use(promise);

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
              subtitle={item.contactNo || "No contact info"}
              amount={item.amount}
              avatarUrl={item.profileUrl || undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!partyLst?.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-3 opacity-60"
        >
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-3xl">👤</div>
          <p className="text-sm font-medium text-muted-foreground">
            No {partyType.toLowerCase()} found matching your search
          </p>
        </motion.div>
      )}
    </div>
  )
}


export { PartyList }

