import { User } from "../types/user";
import { py } from "./base";

export const users = {
  me: async () => {
    return py.get<User>("/users/me");
  },
};
