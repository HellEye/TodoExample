export type ValidationError<T extends Record<string, any>> = {
  message: string;
  fields: {
    [key in keyof T]: string;
  };
};
