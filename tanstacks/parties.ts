import { getPartyDetails, getPartyList, getPartyTransactions } from "@/actions/parties.actions";
import { useSession } from "@/lib/auth/auth-client";
import { PartyType } from "@/lib/generated/prisma/enums";
import { useQuery } from "@tanstack/react-query";

export const useParties = (type: PartyType, search?: string, includeInactive: boolean = false, period: 'month' | 'year' | 'all' = 'all') => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["party-list", type, search, includeInactive, period, businessId],
        queryFn: () => getPartyList(type, search, includeInactive, period),
    });
};

export const usePartyDetails = (partyId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["party-detail", partyId, businessId],
        queryFn: () => getPartyDetails(partyId),
        enabled: !!partyId,
    });
};

export const usePartyTransactions = (partyId: string, period: 'month' | 'year' | 'all' = 'all') => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;
 
    return useQuery({
        queryKey: ["party-transactions", partyId, period, businessId],
        queryFn: () => getPartyTransactions(partyId, period),
        enabled: !!partyId,
    });
};
