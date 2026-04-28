import { getCurrentUser } from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: () => getCurrentUser(),
    });
};
