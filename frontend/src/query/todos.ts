import { api } from "@/api";
import { Todo, TodoCreate, TodoSearch, TodoUpdate } from "@/types/todo";
import {
  QueryKey,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
const keys = {
  useTodos: (search?: TodoSearch) =>
    search
      ? (["todos", "list", search] as const)
      : (["todos", "list"] as const),
};

export const useTodos = (search?: TodoSearch) => {
  return useQuery({
    queryKey: keys.useTodos(search),
    queryFn: async ({ queryKey }) => {
      const [, , params] = queryKey;
      const res = await api.todos.all(params);
      return res.data;
    },
    placeholderData: (data) => data,
  });
};

export const useCreateTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: TodoCreate) => {
      const res = await api.todos.create(data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.useTodos() });
    },
  });
};
export const useToggleTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (todo: Todo) => {
      if (todo.completed) {
        const res = await api.todos.uncomplete(todo.id);
        return res.data;
      }
      const res = await api.todos.complete(todo.id);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.useTodos() });
    },
  });
};

export const useDeleteTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.todos.delete(id);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.useTodos() });
    },
  });
};
export const useUpdateTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (todo: TodoUpdate) => {
      const res = await api.todos.update(todo);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.useTodos() });
    },
  });
};
