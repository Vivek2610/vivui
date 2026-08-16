import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 font-medium",
    "rounded-full whitespace-nowrap",
    "transition-colors duration-fast ease-viv-out",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-muted text-foreground",
        brand: "bg-brand text-brand-foreground",
        soft: "bg-brand-subtle text-brand",
        outline: "border border-border text-foreground bg-transparent",
        glass: "viv-glass text-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/15 text-danger",
        info: "bg-info/15 text-info",
      },
      size: {
        sm: "h-5 px-2 text-[11px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
      dot: false,
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
