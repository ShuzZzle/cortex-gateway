import { IconsId } from "@web/icons";
import { Icon } from "../icon/icon";
import { numberFor, cssVars } from "../../util";
import { DateTime } from "luxon";
import React from "react";
import classes from "./token-card.module.css";

export interface TokenCardProps {
  jwt: string;
  tenant: string;
  audience: string;
  issuer: string;
  scope: string;
  expires: Date;
}

export function TokenCard({ jwt, tenant, audience, issuer, scope, expires }: TokenCardProps): JSX.Element {
  const untilExpiry = DateTime.fromJSDate(expires).toRelative();
  const accessIcon: IconsId = scope === "read" ? "document" : "document-edit";
  const angle = numberFor(tenant, 0, 360);
  const stop1 = `hsla(${angle}deg, 80%, 75%, 1)`;
  const stop2 = `hsla(${angle + 10}deg, 80%, 75%, 1)`;
  const stop3 = `hsla(${angle + 20}deg, 80%, 75%, .8)`;
  const stop4 = `hsla(${angle + 40}deg, 80%, 75%, .6)`;
  const styles = cssVars({ stop1, stop2, stop3, stop4 });

  // const gradient = `linear-gradient(75deg, ${color} 0%, ${color} 5%, ${end} 40%, rgba(0,0,0,0) 100%)`;

  return <article className={classes.card}>
    <header className={classes.header} style={styles}>
      <strong className={classes.tenant}>
        <Icon className={classes.icon} icon={accessIcon} />
        <span children={tenant} />
      </strong>
      <div className={classes.expiry}>
        <Icon icon="stopwatch" />
        <span children={untilExpiry} />
      </div>
    </header>
    <span className={classes.group}>
      <span className={classes.title}>Audience</span>
      <span>{audience}</span>
    </span>
    <span className={classes.group}>
      <span className={classes.title}>Issuer</span>
      <span>{issuer}</span>
    </span>
    <div className={classes.actions}>
      <button children="edit" />
    </div>
  </article>
}
