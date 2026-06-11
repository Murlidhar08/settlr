import { getCurrentUser, getDeviceSessions, setActiveSession, revokeSession } from "@/actions/user.actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: () => getCurrentUser(),
    });
};

export const useDeviceSessions = () => {
    return useQuery({
        queryKey: ["device-sessions"],
        queryFn: () => getDeviceSessions(),
    });
};

export const useSetActiveSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionToken: string) => setActiveSession(sessionToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device-sessions"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
        }
    });
};

export const useRevokeSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionToken: string) => revokeSession(sessionToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device-sessions"] });
        }
    });
};
