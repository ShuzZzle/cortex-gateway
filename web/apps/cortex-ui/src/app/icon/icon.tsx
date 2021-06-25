import { IconsId } from "@web/icons";
import clsx from "clsx";
import React, { HTMLAttributes } from "react";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  icon: IconsId;
}

export function Icon({ icon, className, ...props }: IconProps): JSX.Element {
  return <i {...props} className={clsx({ [className ?? ""]: !!className, [`icon-${icon}`]: true })} />
}
