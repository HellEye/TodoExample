import { VariantProps, cva } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import React, { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const linkVariants = cva(["underline text-slate-200 hover:text-slate-400"], {
  variants: {
    variant: {
      default: "",
      plain: "no-underline",
      button:
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps &
  VariantProps<typeof linkVariants>;

const link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ variant, className, ...props }: Props, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
link.displayName = "Link";

export default link;
