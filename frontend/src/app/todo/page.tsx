import React from "react";
import TodoList from "./TodoList";
import RequiresAuth from "../auth/RequiresAuth";

type Props = {};

const TodoPage = (props: Props) => {
  return (
    <main className="flex flex-col p-8 items-center gap-8">
      <h1 className="text-3xl">TODO List</h1>
      <RequiresAuth>
        <TodoList />
      </RequiresAuth>
    </main>
  );
};

export default TodoPage;
