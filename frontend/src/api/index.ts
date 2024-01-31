import { auth } from "./auth";
import { users } from "./user";
import { todos } from "./todo";

export const api = {
  auth,
  users,
  todos,
} as const;
