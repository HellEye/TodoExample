"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { cx } from "class-variance-authority";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const FormInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { label: string; labelClassName?: string; error?: string }
>(({ label, id, labelClassName, error, ...props }, ref) => {
  return (
    <fieldset className="flex flex-col gap-1">
      <Label htmlFor={label} className={cx("mb-2 ml-2", labelClassName)}>
        {label}
      </Label>
      <Input id={label} ref={ref} {...props} />
      {error && (
        <Label className="ml-2" variant="error">
          {error}
        </Label>
      )}
    </fieldset>
  );
});
FormInput.displayName = "FormInput";

export { Input, FormInput };
