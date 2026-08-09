"use client";

import { addBusiness, deleteBusiness, getBusinessDetailsWithStats, getBusinessList, switchBusiness, updateBusiness } from "@/actions/business.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBusinessList = () => {
    return useQuery({
        queryKey: ["business-list"],
        queryFn: () => getBusinessList(),
    });
};

export const useBusinessDetails = (businessId: string) => {
    return useQuery({
        queryKey: ["business-details", businessId],
        queryFn: () => getBusinessDetailsWithStats(businessId),
        enabled: !!businessId,
    });
};

export const useAddBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => addBusiness(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-list"] });
        },
    });
};

export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name, defaults }: { id: string; name?: string; defaults?: { defAccId?: string | null; defIncomeAccId?: string | null; defExpenseAccId?: string | null } }) =>
            updateBusiness(id, name, defaults),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["business-list"] });
            queryClient.invalidateQueries({ queryKey: ["business-details", variables.id] });
        },
    });
};

export const useDeleteBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBusiness(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["business-list"] });
            queryClient.removeQueries({ queryKey: ["business-details", id] });
        },
    });
};

export const useSwitchBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ businessId, redirectTo }: { businessId: string; redirectTo?: string | null }) =>
            switchBusiness(businessId, redirectTo),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });
};
