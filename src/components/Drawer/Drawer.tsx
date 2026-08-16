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
 * Drawer — VivUI's edge sheet primitive.
 *
 * A side-anchored panel that slides in from the left, right, top, or
 * bottom edge of the viewport. Built on Radix Dialog so it shares the
 * same focus / scroll / a11y guarantees as <Modal> and <Popup>.
 *
 * Sizing semantics:
 *   • left / right  → `size` controls the panel WIDTH.
 *   • top  / bottom → `size` controls the panel HEIGHT.
 *
 * Compound parts:
 *   Drawer.Trigger     — opens the drawer (uncontrolled mode).
 *   Drawer.Content     — the drawer surface; carries `side` + glass/gradient.
 *   Drawer.Header      — Title + Description container.
 *   Drawer.Title       — wired to aria-labelledby (REQUIRED for a11y).
 *   Drawer.Description — wired to aria-describedby (optional).
 *   Drawer.Body        — main content area (auto-scrolls on overflow).
 *   Drawer.Footer      — pinned bottom action bar.
 *   Drawer.CloseButton — overrides the default close button.
 */

/* -------------------------------------------------------------------------- */
/*                                   Root                                      */
/* -------------------------------------------------------------------------- */

export type DrawerProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

function DrawerRoot(props: DrawerProps) {
  return <DialogPrimitive.Root {...props} />;
}
DrawerRoot.displayName = "Drawer";

const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/*                                  Overlay                                    */
/* -------------------------------------------------------------------------- */

export interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/45 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      "data-[state=open]:duration-250 data-[state=closed]:duration-200",
      className,
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "Drawer.Overlay";

/* -------------------------------------------------------------------------- */
/*                                  Content                                    */
/* -------------------------------------------------------------------------- */

const drawerContentVariants = cva(
  [
    "fixed z-50 flex flex-col",
    "bg-surface text-foreground",
    "shadow-viv-xl",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:duration-280 data-[state=closed]:duration-200",
    "focus:outline-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      /**
       * Edge the drawer is anchored to. Picks the side it slides in from
       * AND which corners get rounded (inside-facing only — the side
       * touching the viewport edge stays flush).
       */
      side: {
        left: [
          "left-0 inset-y-0 border-r border-border",
          "rounded-r-2xl",
          "data-[state=open]:slide-in-from-left",
          "data-[state=closed]:slide-out-to-left",
        ],
        right: [
          "right-0 inset-y-0 border-l border-border",
          "rounded-l-2xl",
          "data-[state=open]:slide-in-from-right",
          "data-[state=closed]:slide-out-to-right",
        ],
        top: [
          "top-0 inset-x-0 border-b border-border",
          "rounded-b-2xl",
          "data-[state=open]:slide-in-from-top",
          "data-[state=closed]:slide-out-to-top",
        ],
        bottom: [
          "bottom-0 inset-x-0 border-t border-border",
          "rounded-t-2xl",
          "data-[state=open]:slide-in-from-bottom",
          "data-[state=closed]:slide-out-to-bottom",
        ],
      },
      // Logical size token. Resolved per-side via compoundVariants below.
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      { side: "left", size: "sm", className: "w-[280px] max-w-full" },
      { side: "left", size: "md", className: "w-[380px] max-w-full" },
      { side: "left", size: "lg", className: "w-[520px] max-w-full" },
      { side: "left", size: "xl", className: "w-[680px] max-w-full" },
      { side: "left", size: "full", className: "w-screen" },
      { side: "right", size: "sm", className: "w-[280px] max-w-full" },
      { side: "right", size: "md", className: "w-[380px] max-w-full" },
      { side: "right", size: "lg", className: "w-[520px] max-w-full" },
      { side: "right", size: "xl", className: "w-[680px] max-w-full" },
      { side: "right", size: "full", className: "w-screen" },
      { side: "top", size: "sm", className: "h-[200px] max-h-screen" },
      { side: "top", size: "md", className: "h-[320px] max-h-screen" },
      { side: "top", size: "lg", className: "h-[460px] max-h-screen" },
      { side: "top", size: "xl", className: "h-[600px] max-h-screen" },
      { side: "top", size: "full", className: "h-screen" },
      { side: "bottom", size: "sm", className: "h-[200px] max-h-screen" },
      { side: "bottom", size: "md", className: "h-[320px] max-h-screen" },
      { side: "bottom", size: "lg", className: "h-[460px] max-h-screen" },
      { side: "bottom", size: "xl", className: "h-[600px] max-h-screen" },
      { side: "bottom", size: "full", className: "h-screen" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  },
);

export type DrawerContentVariants = VariantProps<typeof drawerContentVariants>;

export interface DrawerContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
      "children"
    >,
    DrawerContentVariants {
  glass?: boolean | GlassPreset;
  blur?: GlassBlur;
  tint?: number;
  glow?: boolean;
  gradient?: boolean | GradientPreset;
  gradientSpeed?: GradientSpeed;
  sheen?: boolean;
  /** Backdrop click + Escape dismissal. Defaults to `true`. */
  dismissible?: boolean;
  /** Render the dim backdrop overlay. Defaults to `true`. */
  withOverlay?: boolean;
  /** Optional className applied to the overlay. */
  overlayClassName?: string;
  children?: React.ReactNode;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      side = "right",
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
      <DrawerPortal>
        {withOverlay ? <DrawerOverlay className={overlayClassName} /> : null}
        <DialogPrimitive.Content
          ref={ref}
          data-side={side}
          data-glass={g.enabled || undefined}
          data-gradient={gr.enabled ? gr.preset : undefined}
          className={cn(
            drawerContentVariants({ side, size }),
            g.enabled && !gr.enabled && [
              "overflow-hidden",
              "bg-transparent",
              "border-white/30 dark:border-white/12",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),0_24px_48px_-12px_rgba(0,0,0,0.30)]",
              "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),0_24px_48px_-12px_rgba(0,0,0,0.55)]",
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
                  className="pointer-events-none absolute -bottom-24 -right-16 z-0 h-[60%] w-[80%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, hsl(258 95% 68% / 0.7) 0%, hsl(218 95% 58% / 0.45) 32%, transparent 70%)",
                    filter: "blur(10px)",
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

              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                {children}
              </div>
            </>
          ) : (
            children
          )}
        </DialogPrimitive.Content>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = "Drawer.Content";

/* -------------------------------------------------------------------------- */
/*                          Header / Title / Description                       */
/* -------------------------------------------------------------------------- */

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // pr-12 reserves space for the close button. Border-bottom gives a
    // visible split between the title bar and the body, which is the
    // typical Drawer pattern (e.g. Linear, Stripe).
    className={cn(
      "flex flex-col gap-1 px-6 py-5 pr-12 text-left",
      "border-b border-border/60",
      className,
    )}
    {...props}
  />
));
DrawerHeader.displayName = "Drawer.Header";

const DrawerTitle = React.forwardRef<
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
DrawerTitle.displayName = "Drawer.Title";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "Drawer.Description";

/* -------------------------------------------------------------------------- */
/*                                Body / Footer                                */
/* -------------------------------------------------------------------------- */

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Body should fill remaining vertical space and scroll on overflow,
      // so a long form/list inside a drawer doesn't push the footer
      // out of view. min-h-0 is required for flex-1 to actually shrink.
      "flex-1 min-h-0 overflow-y-auto px-6 py-5 text-sm",
      className,
    )}
    {...props}
  />
));
DrawerBody.displayName = "Drawer.Body";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 border-t border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end",
      className,
    )}
    {...props}
  />
));
DrawerFooter.displayName = "Drawer.Footer";

/* -------------------------------------------------------------------------- */
/*                                CloseButton                                  */
/* -------------------------------------------------------------------------- */

export interface DrawerCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
}

const DrawerCloseButton = React.forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  ({ className, "aria-label": ariaLabel = "Close", children, ...props }, ref) => (
    <DrawerClose asChild>
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
          className,
        )}
        {...props}
      >
        {children ?? <CloseIcon />}
      </button>
    </DrawerClose>
  ),
);
DrawerCloseButton.displayName = "Drawer.CloseButton";

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

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
  CloseButton: DrawerCloseButton,
});

export {
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerCloseButton,
  drawerContentVariants,
};
