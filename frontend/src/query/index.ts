import * as users from "./users";
import * as todos from "./todos";
import * as auth from "./auth";
export const queries = {
  users,
  todos,
  auth,
} as const;
