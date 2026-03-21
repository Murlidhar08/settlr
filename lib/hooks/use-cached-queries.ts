"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { getBusinessList } from "@/actions/business.actions";
import { getFinancialAccounts, getFinancialAccountsWithBalance } from "@/actions/financial-account.actions";
import { getUserSettings } from "@/actions/user-settings.actions";
import { getPartyList } from "@/actions/parties.actions";
import { PartyType } from "@/lib/generated/prisma/enums";

/**
 * Hook for fetching and caching the list of parties by type
 */
export function useCachedParties(type: PartyType, search: string = "") {
    return useQuery({
        queryKey: ["parties", type, search],
        queryFn: async () => {
            const list = await getPartyList(type, search);
            return list ?? [];
        },
        staleTime: search ? 1000 * 30 : LONG_STALE_TIME, // Shorter stale time for searches
    });
}

/**
 * Cache durations for mostly static data
 */
const LONG_STALE_TIME = 1000 * 60 * 60; // 1 hour
const SESSION_STALE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * Hook for fetching and caching the user session
 */
export function useCachedSession() {
    return useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const res = await authClient.getSession();
            return res.data;
        },
        staleTime: SESSION_STALE_TIME,
    });
}

/**
 * Hook for fetching and caching the list of businesses
 */
export function useCachedBusinesses() {
    return useQuery({
        queryKey: ["businesses"],
        queryFn: async () => {
            const list = await getBusinessList();
            return list ?? [];
        },
        staleTime: LONG_STALE_TIME,
    });
}

/**
 * Hook for fetching and caching the list of financial accounts
 */
export function useCachedAccounts() {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const list = await getFinancialAccounts();
            return list ?? [];
        },
        staleTime: LONG_STALE_TIME,
    });
}

/**
 * Hook for fetching and caching the list of financial accounts with balances
 */
export function useCachedAccountsWithBalance() {
    return useQuery({
        queryKey: ["financial-accounts"],
        queryFn: async () => {
            const list = await getFinancialAccountsWithBalance();
            return list ?? [];
        },
        staleTime: LONG_STALE_TIME,
    });
}

/**
 * Hook for fetching and caching user settings
 */
export function useCachedUserSettings() {
    return useQuery({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const settings = await getUserSettings();
            return settings;
        },
        staleTime: LONG_STALE_TIME,
    });
}
