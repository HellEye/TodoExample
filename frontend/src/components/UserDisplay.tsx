"use client";
import { useMe } from "@/query/users";
import React from "react";
import { Button } from "./ui/button";
import { useLogOut } from "@/query/auth";

const UserDisplay = () => {
  const user = useMe();
  const logout = useLogOut();
  if (!user.data) return null;
  return (
    <div className="flex flex-col items-center gap-4">
      <p>Hello, {user.data?.username}</p>
      <Button
        size="sm"
        disabled={logout.isPending}
        onClick={() => {
          logout.mutate();
        }}
      >
        Log Out
      </Button>
    </div>
  );
};

export default UserDisplay;
