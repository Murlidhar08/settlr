/**
 * Centralized TanStack Query Keys Factory
 * Prevents key collisions and provides type-safe query key management.
 */

export const QUERY_KEYS = {
    user: {
        all: ["users"] as const,
        current: ["current-user"] as const,
        detail: (id: string) => ["user", id] as const,
        deviceSessions: ["device-sessions"] as const,
        name: ["user-name"] as const,
        documents: (userId: string) => ["user-documents", userId] as const,
    },
    admin: {
        users: ["admin-users"] as const,
        appConfig: ["admin-app-config"] as const,
        storage: {
            all: ["storage"] as const,
            byPath: (path: string) => ["storage", path] as const,
        },
    },
    settings: {
        userSettings: ["user-settings"] as const,
        appVersion: ["app-version"] as const,
        userAccounts: ["user-accounts"] as const,
        userSessions: ["user-sessions"] as const,
        oauthProviders: ["oauth-providers"] as const,
    },
    common: {
        heatMapCoordinates: ["heat-map-coordinates"] as const,
    },
} as const;

export type QueryKeys = typeof QUERY_KEYS;
