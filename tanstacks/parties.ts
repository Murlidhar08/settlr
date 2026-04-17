import { getPartyDetails, getPartyList, getPartyTransactions } from "@/actions/parties.actions";
import { useSession } from "@/lib/auth/auth-client";
import { PartyType } from "@/lib/generated/prisma/enums";
import { useQuery } from "@tanstack/react-query";

export const useParties = (type: PartyType, search?: string, includeInactive: boolean = false) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["party-list", type, search, includeInactive, businessId],
        queryFn: () => getPartyList(type, search, includeInactive),
    });
};

export const usePartyDetails = (partyId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["party-details", partyId, businessId],
        queryFn: () => getPartyDetails(partyId),
        enabled: !!partyId,
    });
};

export const usePartyTransactions = (partyId: string) => {
    const { data: session } = useSession();
    const businessId = session?.user?.activeBusinessId;

    return useQuery({
        queryKey: ["party-transactions", partyId, businessId],
        queryFn: () => getPartyTransactions(partyId),
        enabled: !!partyId,
    });
};
