import { getBudgetInsights } from "@/actions/transaction.actions";
import { useQuery } from "@tanstack/react-query";

export const useBudgetInsights = (businessId?: string | null) => {
    return useQuery({
        queryKey: ["budget-insights", businessId],
        queryFn: () => getBudgetInsights(),
    });
};
