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
 * Popup — a smaller, lighter-weight modal "window".
 *
 * Same Radix Dialog plumbing as <Modal> (focus trap, escape, portal,
 * scroll lock), but tuned for a different UX:
 *
 *   • smaller default size and tighter padding
 *   • softer / optional backdrop (so the page beneath stays visible)
 *   • close button rendered by default at the top-right
 *   • can be anchored to a screen corner (top-right etc.) instead
 *     of always centered — useful for confirmation toasts and
 *     attention-getting alerts that shouldn't block the whole UI.
 *
 * Compound parts:
 *   Popup.Trigger     — opens the popup (uncontrolled mode).
 *   Popup.Content     — the popup surface; carries glass/gradient props.
 *   Popup.Header      — semantic group for Title + Description.
 *   Popup.Title       — wired to aria-labelledby (REQUIRED for a11y).
 *   Popup.Description — wired to aria-describedby (optional).
 *   Popup.Body        — main content slot.
 *   Popup.Footer      — action area.
 *   Popup.CloseButton — overrides the default close button.
 */

/* -------------------------------------------------------------------------- */
/*                                   Root                                      */
/* -------------------------------------------------------------------------- */

export type PopupProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

function PopupRoot(props: PopupProps) {
  return <DialogPrimitive.Root {...props} />;
}
PopupRoot.displayName = "Popup";

const PopupTrigger = DialogPrimitive.Trigger;
const PopupPortal = DialogPrimitive.Portal;
const PopupClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/*                                  Overlay                                    */
/* -------------------------------------------------------------------------- */

export interface PopupOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

/**
 * Popup.Overlay — softer than Modal's. Defaults to an almost-transparent
 * scrim with a faint blur so the underlying page stays partially
 * visible; consumers who want a fully blocking modal should use
 * <Modal> instead.
 */
const PopupOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  PopupOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/25 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      "data-[state=open]:duration-200 data-[state=closed]:duration-150",
      className,
    )}
    {...props}
  />
));
PopupOverlay.displayName = "Popup.Overlay";

/* -------------------------------------------------------------------------- */
/*                                  Content                                    */
/* -------------------------------------------------------------------------- */

const popupContentVariants = cva(
  [
    "fixed z-50 w-[calc(100%-2rem)]",
    "rounded-2xl border border-border bg-surface text-foreground",
    "shadow-viv-lg",
    "p-5",
    // Enter/exit motion — just a fade + scale, no slide. Popups feel
    // lighter than Modals so we keep the motion compact.
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
    "data-[state=open]:duration-180 data-[state=closed]:duration-130",
    "focus:outline-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
      },
      /**
       * Where the popup is anchored on the viewport. `center` is the
       * default (behaves like a small modal). The corner placements are
       * useful for non-blocking notifications / confirmations that
       * shouldn't take over the screen.
       */
      placement: {
        center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "top-left": "left-4 top-4",
        "top-right": "right-4 top-4",
        "bottom-left": "left-4 bottom-4",
        "bottom-right": "right-4 bottom-4",
        top: "left-1/2 top-4 -translate-x-1/2",
        bottom: "left-1/2 bottom-4 -translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "sm",
      placement: "center",
    },
  },
);

export type PopupContentVariants = VariantProps<typeof popupContentVariants>;

export interface PopupContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
      "children"
    >,
    PopupContentVariants {
  glass?: boolean | GlassPreset;
  blur?: GlassBlur;
  tint?: number;
  glow?: boolean;
  gradient?: boolean | GradientPreset;
  gradientSpeed?: GradientSpeed;
  sheen?: boolean;
  /**
   * When `false`, clicks outside / Escape are ignored. The default
   * close button still works. Defaults to `true`.
   */
  dismissible?: boolean;
  /**
   * Render a backdrop overlay. Off by default for popups, since they
   * usually need to coexist with the page UI. Pass `true` for modal
   * popups that block underlying interaction.
   */
  withOverlay?: boolean;
  /** Optional className applied to the overlay (when rendered). */
  overlayClassName?: string;
  /**
   * Render the built-in top-right close button. Defaults to `true` —
   * this matches the "Glass Popup Window" reference where the X is
   * always visible. Set `false` to hide it (or render <Popup.CloseButton>
   * yourself for full control).
   */
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

const PopupContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  PopupContentProps
>(
  (
    {
      className,
      size,
      placement,
      glass,
      blur,
      tint,
      glow,
      gradient,
      gradientSpeed,
      sheen,
      dismissible = true,
      withOverlay = false,
      overlayClassName,
      showCloseButton = true,
      onPointerDownOutside,
      onInteractOutside,
      onEscapeKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const g = resolveGlass({ glass, blur, tint, glow });
    const gr = resolveGradient({ gradient, gradientSpeed, sheen });
    const hasLayers = g.enabled || gr.enabled;

    return (
      <PopupPortal>
        {withOverlay ? <PopupOverlay className={overlayClassName} /> : null}
        <DialogPrimitive.Content
          ref={ref}
          data-glass={g.enabled || undefined}
          data-gradient={gr.enabled ? gr.preset : undefined}
          className={cn(
            popupContentVariants({ size, placement }),
            g.enabled && !gr.enabled && [
              "overflow-hidden",
              "bg-transparent",
              "border-white/30 dark:border-white/12",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),0_18px_36px_-12px_rgba(0,0,0,0.25)]",
              "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),0_18px_36px_-12px_rgba(0,0,0,0.5)]",
            ],
            gr.enabled && [
              "group/gradient overflow-hidden",
              "bg-transparent text-white",
              "border-white/15",
              GRADIENT_SHADOW[gr.preset],
            ],
            className,
          )}
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
                  className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-[80%] w-[80%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, hsl(258 95% 68% / 0.7) 0%, hsl(218 95% 58% / 0.45) 32%, transparent 70%)",
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

          {showCloseButton ? <PopupCloseButton /> : null}
        </DialogPrimitive.Content>
      </PopupPortal>
    );
  },
);
PopupContent.displayName = "Popup.Content";

/* -------------------------------------------------------------------------- */
/*                          Header / Title / Description                       */
/* -------------------------------------------------------------------------- */

const PopupHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 pr-9 text-left", className)}
    {...props}
  />
));
PopupHeader.displayName = "Popup.Header";

const PopupTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-base font-semibold leading-tight tracking-tight",
      className,
    )}
    {...props}
  />
));
PopupTitle.displayName = "Popup.Title";

const PopupDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
PopupDescription.displayName = "Popup.Description";

const PopupBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-3 text-sm", className)} {...props} />
));
PopupBody.displayName = "Popup.Body";

const PopupFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:items-center sm:justify-end",
      className,
    )}
    {...props}
  />
));
PopupFooter.displayName = "Popup.Footer";

/* -------------------------------------------------------------------------- */
/*                                CloseButton                                  */
/* -------------------------------------------------------------------------- */

export interface PopupCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
}

const PopupCloseButton = React.forwardRef<HTMLButtonElement, PopupCloseButtonProps>(
  ({ className, "aria-label": ariaLabel = "Close", children, ...props }, ref) => (
    <PopupClose asChild>
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "absolute right-2.5 top-2.5 z-20",
          "inline-flex size-7 items-center justify-center rounded-full",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-foreground/5 dark:hover:bg-foreground/10",
          "transition-colors duration-fast ease-viv-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          className,
        )}
        {...props}
      >
        {children ?? <CloseIcon />}
      </button>
    </PopupClose>
  ),
);
PopupCloseButton.displayName = "Popup.CloseButton";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Compound assembly                                */
/* -------------------------------------------------------------------------- */

export const Popup = Object.assign(PopupRoot, {
  Trigger: PopupTrigger,
  Portal: PopupPortal,
  Overlay: PopupOverlay,
  Content: PopupContent,
  Header: PopupHeader,
  Title: PopupTitle,
  Description: PopupDescription,
  Body: PopupBody,
  Footer: PopupFooter,
  Close: PopupClose,
  CloseButton: PopupCloseButton,
});

export {
  PopupTrigger,
  PopupPortal,
  PopupOverlay,
  PopupContent,
  PopupHeader,
  PopupTitle,
  PopupDescription,
  PopupBody,
  PopupFooter,
  PopupClose,
  PopupCloseButton,
  popupContentVariants,
};
