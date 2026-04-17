import { getAdminUsers } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";

export const useAdminUsers = () => {
    return useQuery({
        queryKey: ["admin-users"],
        queryFn: () => getAdminUsers(),
    });
};
