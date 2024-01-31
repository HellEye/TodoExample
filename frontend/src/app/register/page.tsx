import React from "react";
import RegisterForm from "./RegisterForm";
import Link from "@/components/ui/link";

type Props = {};

const RegisterPage = (props: Props) => {
  return (
    <main className="flex flex-col gap-16 items-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl">Sign Up</h1>
        <RegisterForm />
      </div>
      <div className="flex flex-row gap-8">
        <p>Already have an account?</p>
        <Link href="/login">Log In Here</Link>
      </div>
    </main>
  );
};

export default RegisterPage;
