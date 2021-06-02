import { DateTime } from "luxon";
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
  return <article className={classes.card}>
    <strong className={classes.header}>{tenant}</strong>
    <span className={classes.group}>
      <span className={classes.title}>Audience</span>
      <span>{audience}</span>
    </span>
    <span className={classes.group}>
      <span className={classes.title}>Issuer</span>
      <span>{issuer}</span>
    </span>
    <span className={classes.group}>
      <span className={classes.title}>Scope</span>
      <span>{scope}</span>
    </span>
    <span className={classes.group}>
      <span className={classes.title}>Expires</span>
      <span>{DateTime.fromJSDate(expires).toLocaleString({
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}</span>
    </span>
    <div className={classes.actions}>
      <button children="edit" />
    </div>
  </article>
}
