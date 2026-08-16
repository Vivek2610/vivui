import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import { useMergedRef } from "../../utils/refs";
import { buttonVariants, type ButtonVariants } from "./Button.variants";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariants {
  /**
   * Render the child element instead of a `<button>`.
   * Useful for wrapping `<Link>` from Next.js while keeping all button styles.
   *
   * @example
   *   <Button asChild><Link href="/docs">Docs</Link></Button>
   */
  asChild?: boolean;
  /** Optional icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Optional icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /**
   * Optional pill/chip rendered after the label and to the right of `rightIcon`.
   * Designed for the "AI Action" pattern where a tiny badge (e.g. ↗) sits
   * inside the button to signal a deep-link or action.
   */
  trailingChip?: React.ReactNode;
  /** Show a loading spinner and disable interactions. */
  isLoading?: boolean;
  /** Accessible label announced when isLoading is true. */
  loadingLabel?: string;
  /**
   * Strength of the magnetic hover pull (0–1). Only applies when
   * `variant="magnetic"`. Default: 0.3 — a subtle, premium feel.
   */
  magneticStrength?: number;
}

/**
 * Button — VivUI's primary action component.
 *
 * Variants:
 *   • `primary`    — solid blue gradient (default)
 *   • `secondary`  — neutral surface with border
 *   • `ghost`      — transparent
 *   • `outline`    — border only
 *   • `soft`       — tinted brand fill
 *   • `glass`      — frosted glassmorphism
 *   • `link`       — inline text link
 *   • `danger`     — red gradient
 *   • `ai`         — gradient + sheen sweep on hover
 *   • `magnetic`   — pointer-tracking magnetic hover
 *   • `gradient`   — animated rainbow gradient with breathing glow
 *
 * Sizes: `xs | sm | md | lg | xl | icon-sm | icon | icon-lg | fab`.
 * Shapes: `pill (default) | rounded | square`.
 *
 * Behavior:
 *   • Polymorphic via `asChild` (Radix Slot).
 *   • Loading state sets `aria-busy="true"` and disables interactions.
 *   • Magnetic variant attaches pointer listeners that translate the button
 *     toward the cursor — gracefully restored on leave + on unmount.
 *   • Respects `prefers-reduced-motion` via the global motion tokens.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      fullWidth,
      asChild = false,
      isLoading = false,
      loadingLabel = "Loading",
      leftIcon,
      rightIcon,
      trailingChip,
      magneticStrength = 0.3,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    const internalRef = React.useRef<HTMLButtonElement | null>(null);
    const setRef = useMergedRef<HTMLButtonElement>(ref, internalRef);

    // Magnetic hover effect — only enabled for the `magnetic` variant.
    React.useEffect(() => {
      if (variant !== "magnetic") return;
      const el = internalRef.current;
      if (!el) return;

      let frame = 0;
      const handleMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * magneticStrength;
        const y = (e.clientY - rect.top - rect.height / 2) * magneticStrength;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      };
      const handleLeave = () => {
        cancelAnimationFrame(frame);
        el.style.transform = "translate3d(0, 0, 0)";
      };

      el.addEventListener("pointermove", handleMove);
      el.addEventListener("pointerleave", handleLeave);
      return () => {
        cancelAnimationFrame(frame);
        el.removeEventListener("pointermove", handleMove);
        el.removeEventListener("pointerleave", handleLeave);
        el.style.transform = "";
      };
    }, [variant, magneticStrength]);

    return (
      <Comp
        ref={setRef}
        type={asChild ? undefined : type}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        data-loading={isLoading || undefined}
        data-variant={variant ?? "primary"}
        className={cn(
          buttonVariants({ variant, size, shape, fullWidth, loading: isLoading }),
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className="sr-only">{loadingLabel}</span>
            <span aria-hidden="true" className="opacity-70">
              {children}
            </span>
          </>
        ) : (
          <>
            {leftIcon ? (
              <span aria-hidden="true" className="relative z-10 inline-flex">
                {leftIcon}
              </span>
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-2">
              {children}
            </span>
            {rightIcon ? (
              <span aria-hidden="true" className="relative z-10 inline-flex">
                {rightIcon}
              </span>
            ) : null}
            {trailingChip ? (
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 inline-flex items-center justify-center",
                  "ml-1 h-5 min-w-5 rounded-full px-1.5",
                  "bg-white/20 text-[11px] font-semibold leading-none",
                  "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]",
                  "[&_svg]:size-3",
                )}
              >
                {trailingChip}
              </span>
            ) : null}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

function Spinner(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-10 size-4 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
