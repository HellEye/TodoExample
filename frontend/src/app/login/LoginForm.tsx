"use client";
import { Login, loginValidator } from "@/types/auth";
import React from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogIn } from "@/query/auth";
import { redirect, useRouter } from "next/navigation";
import { ValidationError } from "@/types/error";
import { AxiosError } from "axios";
type Props = {};

const LoginForm = (props: Props) => {
  const form = useForm<Login>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const login = useLogIn();
  const router = useRouter();
  const onSubmit = (data: Login) => {
    login.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        const e = error as AxiosError<ValidationError<Login>>;
        // As with register form, this could be handled by a custom form+mutation hook
        if (e.response?.data) {
          form.setError("username", {
            type: "manual",
            message: e.response.data.fields.username,
          });
          form.setError("password", {
            type: "manual",
            message: e.response.data.fields.password,
          });
        }
      },
    });
  };
  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-96"
    >
      <FormInput
        label="Username"
        error={errors.username?.message}
        {...form.register("username")}
      />
      <FormInput
        type="password"
        label="Password"
        error={errors.password?.message}
        {...form.register("password")}
      />
      <Button type="submit">Log In</Button>
    </form>
  );
};

export default LoginForm;
