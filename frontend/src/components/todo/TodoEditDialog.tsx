"use client";
import TodoForm from "@/components/todo/TodoForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Todo, TodoCreate } from "@/types/todo";
import React from "react";
import { SubmitHandler } from "react-hook-form";

type Props = {
  todo?: Todo;
  onSubmit: SubmitHandler<TodoCreate>;
  update?: boolean;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
};

const TodoEditDialog = ({
  isOpen,
  setIsOpen,
  update,
  onSubmit,
  todo,
  title,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <TodoForm onSubmit={onSubmit} todo={todo} update={update} />
      </DialogContent>
    </Dialog>
  );
};

export default TodoEditDialog;
