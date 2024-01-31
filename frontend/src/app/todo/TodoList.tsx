"use client";
import { useTodos } from "@/query/todos";
import React, { useState } from "react";
import CreateTodo from "./CreateTodo";
import TodoElement from "@/components/todo/TodoElement";
import { useMe } from "@/query/users";
import { Button } from "@/components/ui/button";

type Props = {};

const TodoList = (props: Props) => {
  const [showComplete, setShowComplete] = useState(false);
  const todos = useTodos({ showComplete });
  const me = useMe();

  if (todos.isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-4 min-w-96 w-[50%] items-stretch">
      <Button
        className="w-full max-w-64 self-center"
        onClick={() => setShowComplete((prev) => !prev)}
      >
        {showComplete ? "Hide" : "Show"} Completed
      </Button>
      {!todos.data || todos.data?.length === 0 ? (
        <p className="text-lg">No todos</p>
      ) : (
        todos.data.map((todo) => <TodoElement key={todo.id} todo={todo} />)
      )}
      <CreateTodo />
    </div>
  );
};

export default TodoList;
