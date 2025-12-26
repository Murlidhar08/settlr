"use client";

import { PartyItem } from "./party-item";
import { useEffect, useState } from "react";
import { getCustomerList } from "@/actions/parties.actions";
import { Party } from "@/lib/generated/prisma/client";

const CustomerList = () => {
  const [customerList, setCustomerList] = useState<Party[]>([]);

  useEffect(() => {
    getCustomerList().then((res: Party[]) => setCustomerList(res));
  }, []);

  return (
    <>
      {
        customerList?.map((item) => {
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
        })
      }
    </>
  )
}

export { CustomerList }
