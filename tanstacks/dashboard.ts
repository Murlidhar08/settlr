"use client";

import { getDashboardSummary } from "@/actions/dashboard.actions";
import { getBudgetInsights } from "@/actions/transaction.actions";
import { useSession } from "@/lib/auth/auth-client";
import { useQuery } from "@tanstack/react-query";

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