"use client";
import React from "react";
import { FormInput } from "../ui/input";
import { Button } from "../ui/button";
import { Todo, TodoCreate, todoCreateValidator } from "@/types/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodObject } from "zod";

type Props = {
  todo?: Todo;
  onSubmit: SubmitHandler<TodoCreate>;
  update?: boolean;
};

const TodoForm = ({ todo, onSubmit, update }: Props) => {
  const form = useForm<TodoCreate>({
    resolver: update ? undefined : zodResolver(todoCreateValidator),
    defaultValues: {
      title: todo?.title ?? undefined,
      description: todo?.description ?? undefined,
    },
  });
  return (
    <form
      key={todo?.id}
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormInput label="Title" {...form.register("title")} />
      <FormInput label="Description" {...form.register("description")} />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default TodoForm;
