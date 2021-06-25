import { IconsId } from "@web/icons";
import { SidebarBase, SidebarBaseProps } from "apps/cortex-ui/src/app/sidebar/sidebar-base";
import { useResponsiveConfiguration } from "apps/cortex-ui/src/context";
import clsx from "clsx";
import React, { ReactNode, ReactNodeArray } from "react";
import { Icon } from "../icon/icon";
import classes from "./menu.module.css";
import { Link, LinkProps, useRouteMatch } from "react-router-dom";

interface MatchLinkProps {
  match: string;
  exact?: boolean;
}

function useActiveClasses({ match, exact }: MatchLinkProps, ...args: Parameters<typeof clsx>): string {
  const m = useRouteMatch(match);
  return clsx({
    [clsx(...args)]: true,
    [classes.active]: exact ? !!m?.isExact : !!m,
    [classes.link]: true,
  });
}

export interface MenuEntryProps extends LinkProps {
  icon: IconsId;
  label: string;
  match: string;
  exact?: boolean;
}

function MenuEntry(props: MenuEntryProps): MenuEntry {
  return {
    button: MenuEntryButton(props),
    label: MenuEntryLabel(props),
  }
}

interface MenuEntry {
  button: JSX.Element;
  label: JSX.Element;
}

function MenuEntryButton({ icon, label, className, match, exact, ...props }: MenuEntryProps): JSX.Element {
  const cls = useActiveClasses({ match, exact }, {
    [className ?? ""]: !!className,
    [classes.button]: true,
  });

  return <Link {...props} className={cls} key={JSON.stringify(props.to)} title={label}>
    <Icon className={classes.icon} icon={icon} />
  </Link>;
}

function MenuEntryLabel({ icon, label, className, match, exact, ...props }: MenuEntryProps): JSX.Element {
  const cls = useActiveClasses({ match, exact }, {
    [className ?? ""]: !!className,
    [classes.label]: true,
  });

  return <Link {...props} className={cls} key={JSON.stringify(props.to)}>
    <span className={classes.label}>{label}</span>
  </Link>
}

export interface MenuProps {
  entries?: MenuEntry[];
  items?: MenuEntryProps[];
  open?: boolean;
  children?: ReactNode | ReactNodeArray;
}

export function Menu({ entries = [], items = [], open, children }: MenuProps = {}): JSX.Element {
  const { props: iconBarProps } = useResponsiveConfiguration<Partial<SidebarBaseProps>>({
    xs: { bottom: true, className: clsx([classes.bottom, classes.menu]) },
    md: { left: true, className: classes.menu },
  });

  const { props: menuBarProps } = useResponsiveConfiguration<Partial<SidebarBaseProps>>({
    xs: { open: false },
    md: { open },
    xl: { static: true, open },
  });

  const { labels, buttons } = items.map(MenuEntry).concat(entries).reduce((all, item) => {
    all.buttons.push(item.button);
    all.labels.push(item.label);
    return all;
  }, { buttons: [] as JSX.Element[], labels: [] as JSX.Element[] });

  return <SidebarBase {...iconBarProps} content={<div className={classes.buttons}>{buttons}</div>} static>
    <SidebarBase {...menuBarProps} content={<div className={classes.labels}>{labels}</div>}>
      {children}
    </SidebarBase>
  </SidebarBase>;
}
