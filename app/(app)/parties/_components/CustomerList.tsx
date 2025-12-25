"use client";

import PartyItem from "./PartyItem";
import { useEffect, useState } from "react";
import { getCustomerList } from "@/actions/parties.actions";
import { Party } from "@/lib/generated/prisma/client";

export default function CustomerList() {
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
                            amount="+$500.00"
                            status="Return"
                            negative
                            avatarUrl={item.profileUrl || undefined}
                        />
                    )
                })
            }
        </>
    )
}
