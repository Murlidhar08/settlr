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

const PartyList = ({ partyType, promise }: PartyListProp) => {
  const partyLst = use(promise);

  return (
    <>
      {partyLst?.map(item => {
        return (
          <PartyItem
            key={item.id}
            id={item.id}
            name={item.name}
            subtitle={item.name}
            amount={item.amount}
            avatarUrl={item.profileUrl || undefined}
          />
        )
      })}

      {!partyLst?.length && (
        <p className="text-sm text-slate-500">
          No {partyType == "CUSTOMER" ? "customer" : "supplier"} yet
        </p>
      )}
    </>
  )
}

export { PartyList }

