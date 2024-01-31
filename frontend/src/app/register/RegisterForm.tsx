"use client";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { useRegister } from "@/query/auth";
import { Register, registerValidator } from "@/types/auth";
import { ValidationError } from "@/types/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";

type Props = {};

const RegisterForm = (props: Props) => {
  const [registered, setRegistered] = useState(false);
  const form = useForm({
    resolver: zodResolver(registerValidator),
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
  });
  const [redirectTime, setRedirectTime] = useState(5);
  const router = useRouter();
  const register = useRegister();
  const onSubmit = (data: Register) => {
    register.mutate(data, {
      onSuccess: () => {
        form.clearErrors();
        form.reset();
        setRegistered(true);
        const interval = setInterval(() => {
          setRedirectTime((t) => {
            if (t <= 0) {
              console.log("redirecting");
              clearInterval(interval);
              router.push("/login");
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      },
      onError: (error) => {
        const e = error as AxiosError<ValidationError<Register>>;
        // Under normal circumstances this would be a separate function to assign errors
        // But here I did it inline
        // I'd actually make a wrapper hook for form+mutation that handles setting errors and clearing form
        if (e.response?.data) {
          form.setError("username", {
            type: "manual",
            message: e.response.data.fields.username,
          });
          form.setError("password", {
            type: "manual",
            message: e.response.data.fields.password,
          });
          form.setError("repeatPassword", {
            type: "manual",
            message: e.response.data.fields.repeatPassword,
          });
        }
      },
    });
  };
  const errors = form.formState.errors;
  if (registered) {
    return (
      <div className="flex flex-col gap-4 w-96">
        <p>Success! Redirecting to login in {redirectTime} seconds.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }
  return (
    <form
      className="flex flex-col gap-4 w-96"
      onSubmit={(data) => {
        form.handleSubmit(onSubmit)(data);
      }}
    >
      {registered && <p>Success!</p>}
      <FormInput
        label="Username"
        error={errors.username?.message}
        {...form.register("username")}
      />
      <FormInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...form.register("password")}
      />
      <FormInput
        type="password"
        label="Repeat Password"
        error={errors.repeatPassword?.message}
        {...form.register("repeatPassword")}
      />
      <Button type="submit">Create Account</Button>
    </form>
  );
};

export default RegisterForm;
