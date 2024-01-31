"use client";
import TodoEditDialog from "@/components/todo/TodoEditDialog";
import { Button } from "@/components/ui/button";

import { useCreateTodo } from "@/query/todos";
import { TodoCreate, todoCreateValidator } from "@/types/todo";
import React, { useState } from "react";

type Props = {};

const CreateTodo = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const createTodo = useCreateTodo();
  const onSubmit = (data: TodoCreate) => {
    createTodo.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };
  return (
    <div className="flex flex-row gap-4 justify-center">
      <Button className="w-full max-w-64" onClick={() => setIsOpen?.(true)}>
        Create Todo
      </Button>

      <TodoEditDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create Todo"
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CreateTodo;
