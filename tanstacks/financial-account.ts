import { getFinancialAccountBalance, getFinancialAccounts } from "@/actions/financial-account.actions";
import { useQuery } from "@tanstack/react-query";

export const useFinancialAccounts = (showInactive: boolean) => {
    const res = useQuery({
        queryKey: ["financial-accounts", showInactive],
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
    const res = useQuery({
        queryKey: ["financial-account", accountId],
        queryFn: () => getFinancialAccountBalance(accountId),
    });

    return {
        balance: res.data,
        isLoading: res.isLoading,
        isError: res.isError,
        error: res.error,
    }
};