import { CSSProperties } from "react";

export function cssVars(vars: Record<string, unknown>): Partial<CSSProperties> {
  return Object.fromEntries(Object.entries(vars).map(([key, value]) => [`--${key}`, value])) as never;
}
