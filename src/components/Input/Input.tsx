import * as React from "react";
import { cn } from "../../utils/cn";
import { inputVariants, type InputVariants } from "./Input.variants";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariants {
  /** Optional content rendered before the input (icon, prefix, etc). */
  startAdornment?: React.ReactNode;
  /** Optional content rendered after the input. */
  endAdornment?: React.ReactNode;
}

/**
 * Input — text input with adornments, glass aesthetic, and ARIA-aware error state.
 *
 * - Forwarded ref.
 * - `invalid` prop ties together styling AND `aria-invalid` for screen readers.
 * - Focus ring uses CSS variables, so theming is automatic.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      invalid,
      startAdornment,
      endAdornment,
      type = "text",
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const hasAdornment = Boolean(startAdornment || endAdornment);

    const inputEl = (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || ariaInvalid || undefined}
        className={cn(
          inputVariants({ variant, size, invalid }),
          hasAdornment && "border-0 ring-0 focus-visible:ring-0 px-0 h-full",
          className,
        )}
        {...props}
      />
    );

    if (!hasAdornment) return inputEl;

    return (
      <div
        data-invalid={invalid || undefined}
        className={cn(
          inputVariants({ variant, size, invalid }),
          "flex items-center gap-2",
          "focus-within:border-brand focus-within:ring-2 focus-within:ring-ring/40",
          invalid &&
            "focus-within:border-danger focus-within:ring-danger/30",
        )}
      >
        {startAdornment ? (
          <span className="flex shrink-0 items-center text-muted-foreground">
            {startAdornment}
          </span>
        ) : null}
        {inputEl}
        {endAdornment ? (
          <span className="flex shrink-0 items-center text-muted-foreground">
            {endAdornment}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
