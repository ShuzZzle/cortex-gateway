import clsx from "clsx";
import React, { ReactNode, ReactNodeArray } from "react";
import classes from "./sidebar-base.module.css";

export interface SidebarBaseProps {
  open?: boolean;
  static?: boolean;
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  content?: ReactNodeArray | ReactNode;
  children: ReactNode | ReactNodeArray;
  className?: string;
}

export function SidebarBase({ children, content, open, top, right, bottom, left, static: static_, className }: SidebarBaseProps): JSX.Element {

  const status = clsx({
    [classes.top]: top,
    [classes.left]: left || top === undefined && bottom === undefined && right === undefined,
    [classes.bottom]: bottom,
    [classes.right]: right,
    [classes.open]: !static_ && open,
    [classes.static]: static_,
    [className ?? ""]: !!className,
  });

  return <div className={clsx([classes.container, status])}>
    {content && <aside className={clsx([classes.sidebar, status])}>{content}</aside>}
    <section className={classes.body}>{children}</section>
  </div>
}
