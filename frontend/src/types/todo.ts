import { z } from "zod";

export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: Date;
  userId: number;
};
export const todoCreateValidator = z.object({
  title: z.string().min(3).max(32),
  description: z.string().max(255).optional(),
});
export type TodoCreate = z.infer<typeof todoCreateValidator>;

export type TodoUpdate = Partial<TodoCreate> & { id: number };

export type TodoSearch = {
  showComplete: boolean;
};
