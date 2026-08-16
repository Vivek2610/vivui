import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import {
  type GlassPreset,
  type GlassBlur,
  type GradientPreset,
  type GradientSpeed,
  resolveGlass,
  resolveGradient,
  BLUR_CLASS,
  GRADIENT_BG,
  GRADIENT_DURATION,
  GRADIENT_SHADOW,
  glassOverlayBackground,
} from "../../internal/surface";

/**
 * Modal — VivUI's centered dialog primitive.
 *
 * Built on Radix Dialog so we get focus trap, escape handling, scroll
 * lock, portal mounting, and full ARIA wiring out of the box. The
 * compound API mirrors Card so the surface vocabulary is consistent:
 * any Modal.Content can opt into frosted glass, an animated gradient
 * background, or both.
 *
 * Compound parts:
 *   Modal.Trigger     — opens the modal (uncontrolled mode).
 *   Modal.Content     — the dialog surface; carries glass/gradient props.
 *   Modal.Header      — semantic group for Title + Description.
 *   Modal.Title       — wired to aria-labelledby (REQUIRED for a11y).
 *   Modal.Description — wired to aria-describedby (optional).
 *   Modal.Body        — main content slot.
 *   Modal.Footer      — action bar (typically right-aligned buttons).
 *   Modal.CloseButton — auto-dismiss button; pairs with Radix's <Close>.
 *
 * Controlled:
 *   <Modal open={open} onOpenChange={setOpen}>
 *     <Modal.Content glass="medium">…</Modal.Content>
 *   </Modal>
 *
 * Uncontrolled:
 *   <Modal>
 *     <Modal.Trigger asChild><Button>Open</Button></Modal.Trigger>
 *     <Modal.Content>…</Modal.Content>
 *   </Modal>
 */

// NOTE: GlassPreset, GlassBlur, GradientPreset, GradientSpeed are publicly
// re-exported from Card (the original surface) — we just consume the
// internal module here. Importing the same names from Modal would create
// duplicate type exports at the package root.

/* -------------------------------------------------------------------------- */
/*                                   Root                                      */
/* -------------------------------------------------------------------------- */

export type ModalProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

function ModalRoot(props: ModalProps) {
  return <DialogPrimitive.Root {...props} />;
}
ModalRoot.displayName = "Modal";

/* -------------------------------------------------------------------------- */
/*                              Trigger / Portal                               */
/* -------------------------------------------------------------------------- */

const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/*                                  Overlay                                    */
/* -------------------------------------------------------------------------- */

export interface ModalOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/55 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      "data-[state=open]:duration-200 data-[state=closed]:duration-150",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = "Modal.Overlay";

/* -------------------------------------------------------------------------- */
/*                                  Content                                    */
/* -------------------------------------------------------------------------- */

const modalContentVariants = cva(
  [
    "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)]",
    "-translate-x-1/2 -translate-y-1/2",
    "rounded-2xl border border-border bg-surface text-foreground",
    "shadow-viv-xl",
    "p-6",
    // Enter/exit motion — fade + zoom + a 4px lift from below.
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
    "data-[state=open]:slide-in-from-bottom-1",
    "data-[state=open]:duration-200 data-[state=closed]:duration-150",
    // Custom focus ring for keyboard users — Radix returns focus to the
    // trigger on close, so we just need the visible focus indicator.
    "focus:outline-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
        "2xl": "max-w-4xl",
        full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type ModalContentVariants = VariantProps<typeof modalContentVariants>;

export interface ModalContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
      "children"
    >,
    ModalContentVariants {
  /**
   * Apply a frosted-glass material on top of the variant. `true` = `"medium"`.
   * Pass a preset (`"subtle"` | `"medium"` | `"strong"`) for a tuned look.
   */
  glass?: boolean | GlassPreset;
  /** Override the frost amount. */
  blur?: GlassBlur;
  /** Surface tint opacity (0–1). */
  tint?: number;
  /** Show the decorative brand-colored blob behind the glass. */
  glow?: boolean;
  /** Animated multi-color gradient surface. `true` = brand palette. */
  gradient?: boolean | GradientPreset;
  /** Pan speed for the gradient. */
  gradientSpeed?: GradientSpeed;
  /** Diagonal sheen sweep on hover. Defaults to `true` when gradient is on. */
  sheen?: boolean;
  /**
   * When `false`, the modal cannot be dismissed by clicking the backdrop
   * or pressing Escape. The CloseButton (and any consumer-controlled
   * `onOpenChange`) still works. Useful for blocking flows like
   * payment confirmations. Defaults to `true`.
   */
  dismissible?: boolean;
  /** Render the overlay backdrop. Defaults to `true`. */
  withOverlay?: boolean;
  /**
   * Optional className for the overlay. Use to recolor / blur differently
   * per modal without overriding the global overlay token.
   */
  overlayClassName?: string;
  children?: React.ReactNode;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      size,
      glass,
      blur,
      tint,
      glow,
      gradient,
      gradientSpeed,
      sheen,
      dismissible = true,
      withOverlay = true,
      overlayClassName,
      onPointerDownOutside,
      onEscapeKeyDown,
      onInteractOutside,
      children,
      ...props
    },
    ref,
  ) => {
    const g = resolveGlass({ glass, blur, tint, glow });
    const gr = resolveGradient({ gradient, gradientSpeed, sheen });
    const hasLayers = g.enabled || gr.enabled;

    return (
      <ModalPortal>
        {withOverlay ? <ModalOverlay className={overlayClassName} /> : null}
        <DialogPrimitive.Content
          ref={ref}
          data-glass={g.enabled || undefined}
          data-gradient={gr.enabled ? gr.preset : undefined}
          className={cn(
            modalContentVariants({ size }),
            // Glass frame — enables when glass is on AND no gradient.
            // The gradient owns the surface and provides its own shadow tokens,
            // so we mustn't double them up.
            g.enabled && !gr.enabled && [
              "overflow-hidden",
              "bg-transparent",
              "border-white/30 dark:border-white/12",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),0_24px_48px_-12px_rgba(0,0,0,0.30)]",
              "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),0_24px_48px_-12px_rgba(0,0,0,0.55)]",
            ],
            // Gradient frame — overrides bg/text/shadow.
            gr.enabled && [
              "group/gradient overflow-hidden",
              "bg-transparent text-white",
              "border-white/15",
              GRADIENT_SHADOW[gr.preset],
            ],
            className,
          )}
          // Wire dismissibility through Radix's intercept handlers. We let
          // consumer-supplied handlers run first and only `preventDefault`
          // when the consumer hasn't already done so.
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (!dismissible && !event.defaultPrevented) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            onInteractOutside?.(event);
            if (!dismissible && !event.defaultPrevented) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            onEscapeKeyDown?.(event);
            if (!dismissible && !event.defaultPrevented) event.preventDefault();
          }}
          {...props}
        >
          {hasLayers ? (
            <>
              {gr.enabled ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
                  style={{
                    backgroundImage: GRADIENT_BG[gr.preset],
                    backgroundSize: "200% 200%",
                    animation: `viv-gradient-pan ${GRADIENT_DURATION[gr.speed]} linear infinite`,
                  }}
                />
              ) : g.glow ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -right-16 z-0 h-[80%] w-[80%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, hsl(258 95% 68% / 0.75) 0%, hsl(218 95% 58% / 0.5) 32%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              ) : null}

              {g.enabled ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-0 z-[1] rounded-[inherit]",
                    BLUR_CLASS[g.blur],
                    "backdrop-saturate-[140%]",
                  )}
                  style={{ background: glassOverlayBackground(g.tint) }}
                />
              ) : null}

              {gr.enabled && gr.sheen ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-y-0 -left-1/3 z-[2] w-1/3",
                    "bg-gradient-to-r from-transparent via-white/40 to-transparent",
                    "translate-x-[-200%] skew-x-[-12deg] opacity-0",
                    "transition-[transform,opacity] duration-[800ms] ease-viv-out",
                    "group-hover/gradient:translate-x-[400%] group-hover/gradient:opacity-100",
                  )}
                />
              ) : null}

              <div className="relative z-10">{children}</div>
            </>
          ) : (
            children
          )}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  },
);
ModalContent.displayName = "Modal.Content";

/* -------------------------------------------------------------------------- */
/*                          Header / Title / Description                       */
/* -------------------------------------------------------------------------- */

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Reserve right padding so the close button never overlaps the title.
    className={cn(
      "flex flex-col gap-1.5 pr-10 text-left",
      className,
    )}
    {...props}
  />
));
ModalHeader.displayName = "Modal.Header";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold leading-tight tracking-tight",
      className,
    )}
    {...props}
  />
));
ModalTitle.displayName = "Modal.Title";

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "Modal.Description";

/* -------------------------------------------------------------------------- */
/*                                Body / Footer                                */
/* -------------------------------------------------------------------------- */

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4 text-sm", className)} {...props} />
));
ModalBody.displayName = "Modal.Body";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-2",
      className,
    )}
    {...props}
  />
));
ModalFooter.displayName = "Modal.Footer";

/* -------------------------------------------------------------------------- */
/*                                CloseButton                                  */
/* -------------------------------------------------------------------------- */

export interface ModalCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Defaults to "Close". */
  "aria-label"?: string;
}

const ModalCloseButton = React.forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
  ({ className, "aria-label": ariaLabel = "Close", children, ...props }, ref) => (
    <ModalClose asChild>
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "absolute right-3 top-3 z-20",
          "inline-flex size-8 items-center justify-center rounded-full",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-foreground/5 dark:hover:bg-foreground/10",
          "transition-colors duration-fast ease-viv-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          // On gradient surfaces the icon needs to flip white for contrast.
          "data-[on-gradient=true]:text-white/85 data-[on-gradient=true]:hover:text-white data-[on-gradient=true]:hover:bg-white/15",
          className,
        )}
        {...props}
      >
        {children ?? <CloseIcon />}
      </button>
    </ModalClose>
  ),
);
ModalCloseButton.displayName = "Modal.CloseButton";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Compound assembly                                */
/* -------------------------------------------------------------------------- */

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
  CloseButton: ModalCloseButton,
});

export {
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalCloseButton,
  modalContentVariants,
};
