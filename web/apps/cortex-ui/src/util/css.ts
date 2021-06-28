import React, { ComponentClass, FunctionComponent } from "react";
import clsx, { ClassValue } from "clsx";
import { CSSProperties } from "react";

export function cssVars(vars: Record<string, unknown>): Partial<CSSProperties> {
  return Object.fromEntries(Object.entries(vars).map(([key, value]) => [`--${key}`, value])) as never;
}

export function withProps<Props, Component extends FunctionComponent<Props> | ComponentClass<Props> | string>(
  component: Component,
  props: Partial<Props>
): FunctionComponent<Props> {
  return function (overrides) {
    return React.createElement(component, { ...props, ...overrides });
  };
}

export function withClasses<Props, Component extends FunctionComponent<Props> | ComponentClass<Props> | string>(
  component: Component,
  ...classes: ClassValue[]
): FunctionComponent<Props> {
  return function (props) {
    const { className, ...overrides } = (props as never) as { className: string } & Props;
    return React.createElement(component, { className: clsx(...classes, className), ...overrides } as never);
  };
}
