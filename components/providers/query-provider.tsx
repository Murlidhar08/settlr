"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";

import { Persister } from "@tanstack/react-query-persist-client";

// Persistent caching setup
const persister: Persister = (typeof window !== "undefined"
    ? createAsyncStoragePersister({
        storage: window.localStorage,
        key: 'SETTLR_OFFLINE_CACHE',
    })
    : {
        persistClient: async () => { },
        restoreClient: async () => undefined,
        removeClient: async () => { },
    }) as Persister;

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes default
                        gcTime: 1000 * 60 * 60 * 24, // 24 hours in cache
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
