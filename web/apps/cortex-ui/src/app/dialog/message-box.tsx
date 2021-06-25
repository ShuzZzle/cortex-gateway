import { Dialog } from "apps/cortex-ui/src/app/dialog/dialog";
import { Icon } from "../icon/icon";
import clsx from "clsx";
import { ReactNode, ReactNodeArray, useCallback, useEffect, useState } from "react";
import { IconsId } from "@web/icons";
import React from "react";
import classes from "./message-box.module.css";

function tryLookup<T>(source: unknown, key: string): T | undefined {
  return source && typeof source === "object" && key in source ? (source as never)[key] : undefined;
}

function DefaultRenderOption<T = unknown>(option: T, index: number, onClick?: () => void): JSX.Element {
  const wrapped = typeof option === "string" ? { text: option } as never : option;
  const text = tryLookup<string>(wrapped, "text");
  const caption = tryLookup<string>(wrapped, "caption");
  const icon = tryLookup<IconsId>(wrapped, "icon");
  const primary = tryLookup<boolean>(wrapped, "primary");
  return <OptionButton text={text ?? caption} icon={icon} primary={primary} key={index} onClick={onClick} />;
}

export interface OptionButtonProps {
  text?: string;
  icon?: IconsId;
  primary?: boolean;
  onClick?(): void;
}

export function OptionButton({ text, icon, primary, onClick }: OptionButtonProps): JSX.Element {
  return <button className={clsx({ [classes.button]: true, [classes.primary]: primary })} onClick={onClick}>
    {icon && <Icon icon={icon} />}
    <span>{text}</span>
  </button>;
}

export interface MessageBoxProps<T> {
  title: string;
  text: string;
  open?: boolean;
  options: T[];
  closeOption?: T;
  onAction?(option: T): void;
  renderOption?(option: T, index: number, onClick: () => void): ReactNodeArray | ReactNode;
}

export function MessageBox<T = unknown>({
  title,
  text,
  open = false,
  options,
  closeOption,
  onAction,
  renderOption = DefaultRenderOption,
}: MessageBoxProps<T>): JSX.Element {
  const [localOpen, setOpen] = useState(open);
  useEffect(() => setOpen(open), [open]);


  function handleClose() {
    if (closeOption) onAction?.(closeOption);
    setOpen(false);
  }

  function handleAction(option: T) {
    onAction?.(option);
    setOpen(false);
  }

  const footer = options.map((option, index) => renderOption(option, index, () => handleAction(option)));

  return <Dialog open={localOpen} closable={!!closeOption} header={title} footer={footer} onClose={handleClose}>
    {text}
  </Dialog>;
}
