"use client";

import PartyItem from "./PartyItem";
import { useEffect, useState } from "react";
import { getSupplierList } from "@/actions/parties.actions";
import { Party } from "@/lib/generated/prisma/client";

export default function CustomerList() {
    const [supplierList, setSupplierList] = useState<Party[]>([]);

    useEffect(() => {
        getSupplierList().then((res: Party[]) => setSupplierList(res));
    }, []);

    return (
        <>
            {
                supplierList?.map((item, idx) => {
                    return (
                        <PartyItem
                            key={idx}
                            id={item.id}
                            name={`${item.id} - ${item.name}`}
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
