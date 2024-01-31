"use client";

import { useMe } from "@/query/users";
import React, { useEffect } from "react";
import { useAuthManager } from "./authManager";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  children?: React.ReactNode;
};

const RequiresAuth = ({ children }: Props) => {
  const me = useMe();
  const auth = useAuthManager();
  const router = useRouter();

  useEffect(() => {
    if (!me.data && !auth.access_token) {
      router.push("/login");
    }
  }, [me, auth, router]);
  if (me.isLoading) return <div>Loading...</div>;
  return children;
};

export default RequiresAuth;
