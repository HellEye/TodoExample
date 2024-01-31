import { api } from "@/api";
import { useAuthManager } from "@/app/auth/authManager";
import { User } from "@/types/user";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
export const keys = {
  useMe: () => ["users", "me"],
};
export const useMe = () => {
  const access_token = useAuthManager((state) => state.access_token);
  return useQuery<User>({
    queryKey: keys.useMe(),
    queryFn: async () => {
      const res = await api.users.me();
      return res.data;
    },
    enabled: !!access_token,
  });
};
