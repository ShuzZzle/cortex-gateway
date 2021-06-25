import React, { MouseEventHandler } from "react";
import classes from "./avatar.module.css";

export interface AvatarProps {
  src?: string;
  name?: string;
  description?: string;
  onClick?: MouseEventHandler;
}

export function Avatar({ src, name = "Guest", description, onClick }: AvatarProps): JSX.Element {
  return <figure className={classes.avatar} onClick={onClick} tabIndex={onClick ? 0 : undefined}>
    <div className={classes.display}>
      <img src={src} alt={name} className={classes.image} />
    </div>
    <p className={classes.info}>
      <strong className={classes.name}>{name}</strong>
      <span className={classes.description}>{description}</span>
    </p>
  </figure>;
}
