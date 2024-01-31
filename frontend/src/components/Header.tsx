import React, { Suspense } from "react";
import UserDisplay from "./UserDisplay";
import Link from "@/components/ui/link";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="bg-slate-900 min-h-32 mb-4 flex flex-row gap-8 items-center px-8 py-4">
      <Link href="/" variant="plain">
        <h1 className="text-3xl">Todo App</h1>
      </Link>
      <div className="flex-grow" />
      <UserDisplay />
    </header>
  );
};

export default Header;
