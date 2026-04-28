import { getAdminUsers, getAdminAppConfig } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";

export const useAdminUsers = () => {
    return useQuery({
        queryKey: ["admin-users"],
        queryFn: () => getAdminUsers(),
    });
};

export const useAppConfig = () => {
    return useQuery({
        queryKey: ["admin-app-config"],
        queryFn: () => getAdminAppConfig(),
    });
};
