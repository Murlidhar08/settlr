"use client";

// Packages
import { useEffect, useState } from "react";
import { PartyType } from "@/lib/generated/prisma/enums";
// Action
import { getPartyList } from "@/actions/parties.actions";
// componets
import { PartyItem } from "./party-item";
// Types
import { PartyRes } from "@/types/party/PartyRes";


interface PartyListProp {
  partyType: PartyType
}

const PartyList = ({ partyType }: PartyListProp) => {
  const [partyLst, setPartyLst] = useState<PartyRes[]>([]);

  useEffect(() => {
    if (!partyType) return;

    getPartyList(partyType).then((res: PartyRes[]) => setPartyLst(res));
  }, [partyType]);

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
    </>
  )
}

export { PartyList }
