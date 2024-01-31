import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "../register/RegisterForm";
import Link from "@/components/ui/link";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <main className="flex flex-col gap-16 items-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl">Log In</h1>
        <LoginForm />
      </div>
      <div className="flex flex-row gap-8">
        <p>Don&apos;t have an account?</p>
        <Link href="/register">Create an account</Link>
      </div>
    </main>
  );
};

export default LoginPage;
