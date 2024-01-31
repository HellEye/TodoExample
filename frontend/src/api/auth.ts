import { AuthToken, Login, Register } from "../types/auth";
import { Message } from "../types/common";
import { py } from "./base";

export const auth = {
  login: async (data: Login) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    return py.post<AuthToken>("/auth/login", formData);
  },
  register: async (data: Register) => {
    return py.post<Message>("/auth/register", data).then((res) => res?.data);
  },
  refresh: async () => {
    return py.post<AuthToken>("/auth/refresh");
  },
  logout: async () => {
    return py.post<Message>("/auth/logout");
  },
};
