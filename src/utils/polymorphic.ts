import type * as React from "react";

/**
 * Polymorphic component helper types.
 *
 * Usage:
 *   type ButtonProps<C extends React.ElementType = "button"> =
 *     PolymorphicProps<C, { variant?: "solid" | "outline" }>;
 *
 *   const Button = <C extends React.ElementType = "button">(
 *     { as, ...props }: ButtonProps<C>
 *   ) => { ... };
 *
 * Pairs nicely with @radix-ui/react-slot's <Slot /> for `asChild` patterns.
 */
export type AsProp<C extends React.ElementType> = { as?: C };

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicProps<
  C extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PolymorphicPropsWithRef<
  C extends React.ElementType,
  Props = object,
> = PolymorphicProps<C, Props> & { ref?: PolymorphicRef<C> };
