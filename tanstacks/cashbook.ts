import { getCashbookTransactions, getTransactionDetail } from "@/actions/transaction.actions";
import { useSession } from "@/lib/auth/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useCashbook = (filters: {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["cashbook-transactions", filters, businessId],
        queryFn: () => getCashbookTransactions(filters),
    });
};

export const useTransactionDetail = (transactionId: string) => {
    return useQuery({
        queryKey: ["transaction-detail", transactionId],
        queryFn: () => getTransactionDetail(transactionId),
        enabled: !!transactionId,
    });
};
