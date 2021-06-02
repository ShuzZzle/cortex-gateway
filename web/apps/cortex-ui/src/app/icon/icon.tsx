import React from "react";

export interface IconProps {
  icon: string;
}

export function Icon({ icon, ...props }: IconProps): JSX.Element {
  return <span className={icon} {...props} />
}
