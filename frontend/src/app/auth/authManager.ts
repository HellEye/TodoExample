import { AuthToken } from "@/types/auth";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export type AuthManager = AuthToken & {
  expires_at: number;
  setToken: (token: AuthToken) => void;
  logout: () => void;
  shouldRefresh: () => boolean;
};

export const authManagerStore = create(
  persist(
    devtools<AuthManager>(
      (set, get) => ({
        access_token: "",
        token_type: "",
        expires_in: -1,
        expires_at: -1,
        setToken: (token) => {
          set(
            { ...token, expires_at: Date.now() + token.expires_in * 1000 },
            false,
            "setToken"
          );
        },

        logout: () => {
          set(
            {
              access_token: "",
              token_type: "",
              expires_at: -1,
              expires_in: -1,
            },
            false,
            "logout"
          );
        },
        shouldRefresh: () => {
          const now = Date.now();
          const expiresAt = get().expires_at;
          return !!get().access_token && now > expiresAt;
        },
      }),
      {
        name: "authManager",
      }
    ),
    {
      name: "auth",
    }
  )
);

// Store wrapper, apparently Zustand doesn't like nextjs server rendering
// from https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>(result);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export const useAuthManager = <
  T extends Partial<AuthManager> | AuthManager[keyof AuthManager] = AuthManager
>(
  callback: (state: AuthManager) => T = (state) => state as T
) => useStore(authManagerStore, callback);
