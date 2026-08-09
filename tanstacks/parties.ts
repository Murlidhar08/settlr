import { addParties, deleteParty, getPartyDetails, getPartyList, getPartyTransactions, updateParty } from "@/actions/parties.actions";
import { useSession } from "@/lib/auth/auth-client";
import { PartyType } from "@/lib/generated/prisma/enums";
import { PartyInput } from "@/types/party/PartyRes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useAddParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PartyInput) => addParties(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["party-list"] });
            queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
        },
    });
};

export const useUpdateParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ partyId, data }: { partyId: string; data: Partial<PartyInput> }) => updateParty(partyId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["party-list"] });
            queryClient.invalidateQueries({ queryKey: ["party-detail", variables.partyId] });
            queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
        },
    });
};

export const useDeleteParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (partyId: string) => deleteParty(partyId),
        onSuccess: (_, partyId) => {
            queryClient.invalidateQueries({ queryKey: ["party-list"] });
            queryClient.removeQueries({ queryKey: ["party-detail", partyId] });
            queryClient.removeQueries({ queryKey: ["party-transactions", partyId] });
            queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
        },
    });
};
