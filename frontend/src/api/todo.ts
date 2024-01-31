import { Todo, TodoCreate, TodoSearch, TodoUpdate } from "../types/todo";
import { py } from "./base";

export const todos = {
  all: (params?: TodoSearch) => {
    return py.get<Array<Todo>>("/todos", { params });
  },
  create: (data: TodoCreate) => {
    return py.post<Todo>("/todos", data);
  },
  update: ({ id, ...data }: TodoUpdate) => {
    return py.put<Todo>(`/todos/${id}`, data);
  },
  delete: (id: number) => {
    return py.delete(`/todos/${id}`);
  },
  get: (id: number) => {
    return py.get<Todo>(`/todos/${id}`);
  },
  complete: (id: number) => {
    return py.post<Todo>(`/todos/${id}/complete`);
  },
  uncomplete: (id: number) => {
    return py.post<Todo>(`/todos/${id}/uncomplete`);
  },
};
