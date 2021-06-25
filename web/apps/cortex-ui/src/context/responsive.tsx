/*!
 * ResponsiveContext v1 (2021) by Merlin Reichwald
 * @license MIT
 */
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

export type ResponsiveKeyRefs<V> = { [Key in ResponsiveSize]: V | Exclude<ResponsiveSize, Key> };
export type ResponsiveSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ResponsiveConfiguration<T> = Partial<ResponsiveKeyRefs<T>>;

export type Breakpoints = Record<ResponsiveSize, number>;
export const TailwindBreakpoints: Breakpoints = { xs: 640, sm: 768, md: 1024, lg: 1280, xl: 1536  };
export const ResponsiveSizes = "xs,sm,md,lg,xl".split(",") as ResponsiveSize[];
const BreakDown: ResponsiveKeyRefs<never> = { xl: "lg", lg: "md", md: "sm", sm: "xs", xs: "sm" };

function getResponsiveSize({ xs, sm, md, lg }: Breakpoints = TailwindBreakpoints): ResponsiveSize {
  const { innerWidth } = window;
  if (innerWidth <= xs) return "xs";
  if (innerWidth <= sm) return "sm";
  if (innerWidth <= md) return "md";
  if (innerWidth <= lg) return "lg";
  return "xl";
}

function resolveResponsiveConfig<T>(cfg: ResponsiveConfiguration<T>, size: ResponsiveSize): T {
  const config = { ...BreakDown, ...cfg };
  const orig = size;
  for (let count = 0; typeof config[size] === "string" && count < ResponsiveSizes.length; count++) size = config[size] as ResponsiveSize;
  if (typeof config[size] !== "object") throw new Error(`No responsive configuration fallback provided or circular fallbacks for size ${orig}.`);
  return config[size] as T;
}

const ResponsiveSizeContext = createContext(getResponsiveSize(TailwindBreakpoints));

export function ResponsiveSizeProvider({ breakpoints = TailwindBreakpoints, children }: { breakpoints?: Breakpoints, children?: ReactNode }) {
  const [size, setSize] = useState(getResponsiveSize(breakpoints));
  useEffect(() => {
    const handler = () => setSize(getResponsiveSize(breakpoints));
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [breakpoints])
  return <ResponsiveSizeContext.Provider value={size}>{children}</ResponsiveSizeContext.Provider>;
}

export function useResponsiveSize(): { size: ResponsiveSize } & Partial<Record<ResponsiveSize, true>> {
  const size = useContext(ResponsiveSizeContext);
  return { size, [size]: true };
}

export function useResponsiveConfiguration<T = never>(config?: ResponsiveConfiguration<T>, fallback?: T): { props: T, size: ResponsiveSize } {
  const size = useContext(ResponsiveSizeContext);
  const props: T = typeof config === "undefined" ? fallback ?? undefined as never : { ...(fallback ?? {}), ...resolveResponsiveConfig(config, size) };
  return { size, props }
}

export function createResponsiveComponent<Props, Comp extends FC<Props>>(Component: Comp, config: ResponsiveConfiguration<Props>): Comp {
  return function InlineResponsive$(overrides: Props) {
    const { props } = useResponsiveConfiguration(config);
    return <Component {...overrides} {...props as never} />;
  } as never;
}
