import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { HTMLAttributes, ReactNode, ReactNodeArray } from "react";
import ReactDOM from "react-dom";
import classes from "./dialog.module.css";



export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode | ReactNodeArray;
  children?: ReactNode | ReactNodeArray;
  footer?: ReactNode | ReactNodeArray;
  closable?: boolean;
  open?: boolean;
  onClose?(): void;
}

export function createStaticArea(id = "static-area"): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("id", id);
  document.body.appendChild(el);
  return el;
}

export function getOrCreateStaticArea(id = "static-area"): HTMLElement {
  return document.getElementById(id) as HTMLElement ?? createStaticArea(id);
}

export function useStaticArea(id = "static-area"): HTMLElement {
  const [el, setEl] = useState(() => getOrCreateStaticArea(id))
  useEffect(() => setEl(getOrCreateStaticArea(id)), [id])
  return el as HTMLElement;
}


export function Dialog({ className, children, header, footer, closable, open = false, onClose, ...props }: DialogProps): JSX.Element {
  const area = useStaticArea();
  const handleClose = useCallback(() => open && closable && onClose?.(), [open, closable, onClose]);

  return ReactDOM.createPortal(<>
    <div className={clsx({ [classes.backdrop]: true, [classes.open]: open })} onClickCapture={handleClose}/>
    <div {...props} className={clsx({ [`${classes.dialog} ${className}`]: true, [classes.closable]: closable, [classes.open]: open })}>
      <header className={classes.header}>{header}</header>
      <main className={classes.body}>{children}</main>
      <footer className={classes.footer}>{footer}</footer>
    </div>
  </>, area);
}
