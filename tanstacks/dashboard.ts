"use client";

import { getFirstName } from "@/actions/dashboard.actions";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/actions/dashboard.actions";
import { getBudgetInsights } from "@/actions/transaction.actions";
import { useSession } from "@/lib/auth/auth-client";

export const useFirstName = () => {
    return useQuery({
        queryKey: ["user-name"],
        queryFn: () => getFirstName(),
    });
};

export const useBudgetInsights = () => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["budget-insights", businessId],
        queryFn: () => getBudgetInsights(),
    });
};

export const useDashboardSummary = () => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;
    return useQuery({
        queryKey: ["dashboard-summary", businessId],
        queryFn: () => getDashboardSummary(businessId),
    });
}