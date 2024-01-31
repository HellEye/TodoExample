"use client";
import { ConfirmContext } from "@/components/ui/confirmation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = {
  children?: React.ReactNode;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmContext>{children}</ConfirmContext>
    </QueryClientProvider>
  );
};

export default Providers;
