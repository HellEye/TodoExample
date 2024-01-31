"use client";
import React, { useEffect } from "react";
import { useAuthManager } from "./authManager";
import { useRefresh } from "@/query/auth";
import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/query";
/**
 * Component that refreshes the auth token when necessary
 */
const AuthRefresher = () => {
  const { shouldRefresh } = useAuthManager();
  const { logout, expires_at } = useAuthManager();
  const refresh = useRefresh();
  const qc = useQueryClient();
  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldRefresh()) {
        refresh.mutate();
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [refresh, shouldRefresh]);
  useEffect(() => {
    if (expires_at < Date.now()) {
      qc.removeQueries({ queryKey: queries.users.keys.useMe() });
      logout();
    }
  }, [expires_at, logout, qc]);
  return null;
};

export default AuthRefresher;
