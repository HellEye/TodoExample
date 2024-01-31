"use client";
import { useMe } from "@/query/users";
import Image from "next/image";
import Link from "@/components/ui/link";
import { useAuthManager } from "./auth/authManager";

export default function Home() {
  const me = useMe();
  const { shouldRefresh } = useAuthManager();
  if (shouldRefresh())
    return <main className="flex flex-col items-center p-8">Loading...</main>;
  return (
    <main className="flex flex-col items-center justify-between p-8">
      {!me.data && (
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl">You are not logged in</h1>
          <Link href="/login" className="text-xl">
            Log In
          </Link>
        </div>
      )}
      {me.data && (
        <Link variant="button" href="/todo" className="text-3xl">
          Go to TODO List
        </Link>
      )}
    </main>
  );
}
