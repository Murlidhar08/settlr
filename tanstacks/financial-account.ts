import { getFinancialAccountBalance, getFinancialAccounts } from "@/actions/financial-account.actions";
import { getAccountStats, getAccountTransactions } from "@/actions/transaction.actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth/auth-client";

export const useFinancialAccounts = (showInactive: boolean) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    const res = useQuery({
        queryKey: ["financial-accounts", showInactive, businessId],
        queryFn: () => getFinancialAccounts(showInactive),
    });

    return {
        allAccounts: res.data,
        isLoading: res.isLoading,
        isError: res.isError,
        error: res.error,
    }
};

export const useFinancialAccountBalance = (accountId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    const res = useQuery({
        queryKey: ["financial-account", accountId, businessId],
        queryFn: () => getFinancialAccountBalance(accountId),
    });

    return {
        balance: res.data,
        isLoading: res.isLoading,
        isError: res.isError,
        error: res.error,
    }
};

export const useAccountStats = (accountId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["account-stats", accountId, businessId],
        queryFn: () => getAccountStats(accountId),
        enabled: !!accountId,
    });
};

export const useAccountTransactions = (accountId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useInfiniteQuery({
        queryKey: ["account-transactions", accountId, businessId],
        queryFn: ({ pageParam = 1 }) => getAccountTransactions(accountId, { page: pageParam as number, limit: 20 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.length * 20;
            return loadedCount < lastPage.totalTransactions ? allPages.length + 1 : undefined;
        },
        enabled: !!accountId,
    });
};