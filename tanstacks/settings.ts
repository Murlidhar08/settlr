import { getAppVersion } from "@/actions/user-settings.actions";
import { useQuery } from "@tanstack/react-query";

export const useAppVersion = () => {
    return useQuery({
        queryKey: ["app-version"],
        queryFn: () => getAppVersion(),
    });
};
