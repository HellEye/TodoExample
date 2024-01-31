import { z } from "zod";

export const loginValidator = z.object({
  username: z.string(),
  password: z.string(),
});
export type Login = z.infer<typeof loginValidator>;
export const registerValidator = z
  .object({
    username: z.string().min(3).max(32),
    password: z.string().min(6, "Password is too short").max(64),
    repeatPassword: z.string().min(6, "Password is too short").max(64),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["repeatPassword"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["password"],
      });
    }
  });
export type Register = z.infer<typeof registerValidator>;
export type AuthToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};
