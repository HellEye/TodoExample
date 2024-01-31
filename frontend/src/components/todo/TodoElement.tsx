"use client";
import { Todo, TodoCreate } from "@/types/todo";
import { cx } from "class-variance-authority";
import {
  CheckIcon,
  CrossIcon,
  Delete,
  DeleteIcon,
  Edit,
  SquareIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from "@/query/todos";
import TodoEditDialog from "./TodoEditDialog";
import { SubmitHandler } from "react-hook-form";
import { useConfirm } from "../ui/confirmation";
import dayjs from "dayjs";
type Props = {
  todo: Todo;
};

const TodoElement = ({ todo }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleTodo = useToggleTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const confirmDialog = useConfirm({
    title: "Delete Todo",
    description: "Are you sure you want to delete this todo?",
    confirmText: "Delete",
    confirmVariant: "destructive",
  });
  const onDelete = async () => {
    if (await confirmDialog.open()) deleteTodo.mutate(todo.id);
  };

  const onSubmit: SubmitHandler<TodoCreate> = (data) => {
    updateTodo.mutate(
      { ...data, id: todo.id },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };
  return (
    <div
      className={cx(
        "flex flex-row gap-4 rounded-md px-8  py-4 min-w-92 border-2 border-slate-700 items-center",
        {
          "bg-slate-900": !todo.completed,
          "bg-slate-700": todo.completed,
        }
      )}
    >
      <div className="flex flex-col gap-4">
        <p
          className={cx("text-2xl font-bold", {
            "line-through": todo.completed,
          })}
        >
          {todo.title}
        </p>
        <p
          className={cx({
            "line-through": todo.completed,
          })}
        >
          {todo.description}
        </p>
        {todo.completed && (
          <p className={cx("text-slate-500")}>
            Completed: {dayjs(todo.completed).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        )}
      </div>
      <div className="justify-center ml-auto flex flex-row gap-4">
        <Button size="icon" onClick={() => setIsOpen(true)}>
          <Edit
            size="1em"
            className={cx("text-3xl hover:text-blue-500 cursor-pointer")}
          />
        </Button>
        <Button
          size="icon"
          onClick={() => {
            toggleTodo.mutate(todo);
          }}
          className="relative"
        >
          <SquareIcon className="absolute inset-0 text-[40px] text-slate-800" />
          <CheckIcon
            className={cx(
              "text-5xl absolute hover:text-green-500 cursor-pointer",
              {
                "text-transparent hover:text-green-500": !todo.completed,
                "text-red-900 hover:text-red-500": todo.completed,
              }
            )}
          />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => onDelete()}>
          <Trash2Icon className="text-xl" />
        </Button>
      </div>
      <TodoEditDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Edit Todo"
        todo={todo}
        onSubmit={onSubmit}
        update
      />
    </div>
  );
};

export default TodoElement;
