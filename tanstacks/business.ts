"use client";

import { getBusinessList } from "@/actions/business.actions";
import { useQuery } from "@tanstack/react-query";

export const useBusinessList = () => {
    return useQuery({
        queryKey: ["business-list"],
        queryFn: () => getBusinessList(),
    });
};
