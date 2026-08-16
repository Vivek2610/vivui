import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  [
    "w-full bg-transparent text-foreground placeholder:text-muted-foreground",
    "transition-colors duration-fast ease-viv-out",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ],
  {
    variants: {
      variant: {
        outline: [
          "border border-border rounded-md",
          "hover:border-brand/40",
          "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40",
        ],
        filled: [
          "bg-surface-overlay border border-transparent rounded-md",
          "hover:bg-muted",
          "focus-visible:bg-surface focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40",
        ],
        glass: [
          "viv-glass rounded-md",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:shadow-viv-glow",
        ],
        underline: [
          "border-0 border-b border-border rounded-none px-0",
          "focus-visible:border-brand",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3.5 text-sm",
        lg: "h-11 px-4 text-base",
      },
      invalid: {
        true: "border-danger focus-visible:border-danger focus-visible:ring-danger/30",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      invalid: false,
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
