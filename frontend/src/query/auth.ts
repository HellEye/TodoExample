import { api } from "@/api";
import { useAuthManager } from "@/app/auth/authManager";
import { Login, Register } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from ".";
export const useLogIn = () => {
  const auth = useAuthManager();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Login) => {
      const res = await api.auth.login(data);
      return res.data;
    },
    onSuccess: (data) => {
      auth.setToken(data);
      qc.invalidateQueries({
        queryKey: queries.users.keys.useMe(),
      });
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: Register) => {
      return api.auth.register(data);
    },
  });
};
export const useLogOut = () => {
  const auth = useAuthManager();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.auth.logout();
      return res.data;
    },
    onSuccess: () => {
      auth.logout();
    },
    onSettled: () => {
      qc.removeQueries({
        queryKey: queries.users.keys.useMe(),
      });
    },
  });
};
export const useRefresh = () => {
  const auth = useAuthManager();
  return useMutation({
    mutationFn: async () => {
      const res = await api.auth.refresh();
      return res.data;
    },
    onSuccess: (data) => {
      auth.setToken(data);
    },
  });
};
