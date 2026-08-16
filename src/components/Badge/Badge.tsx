import * as React from "react";
import { cn } from "../../utils/cn";
import { badgeVariants, type BadgeVariants } from "./Badge.variants";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    BadgeVariants {
  /** When true, renders a colored status dot before the label. */
  withDot?: boolean;
  /** Optional pulsing dot — useful for "live" / "AI" indicators. */
  pulse?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, withDot, pulse, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, dot: withDot }), className)}
      {...props}
    >
      {withDot ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full bg-current",
            pulse && "animate-viv-pulse-glow",
          )}
        />
      ) : null}
      {children}
    </span>
  ),
);

Badge.displayName = "Badge";
