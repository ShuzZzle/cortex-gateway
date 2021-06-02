import { Icon } from "apps/cortex-ui/src/app/icon/icon";
import { Breadcrumb } from "apps/cortex-ui/src/store/breadcrumbs";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from './page.module.css';

export interface PageProps {
  drawer: unknown;
  children: unknown;
  toolbar: unknown;
  crumbs: Breadcrumb[];
}

export function Page({ drawer, children, toolbar, crumbs } : PageProps) {
  const [open, setOpen] = useState(false)
  const toggleDrawer = useCallback(() => setOpen(!open), [open]);


  const drawerToggleButton = <button className={styles.hamburger} onClick={toggleDrawer}>
    <Icon icon="edit" />
    Hamburger
  </button>;

  return (
    <div className={styles.app}>
      <nav className={styles.toolbar}>
        {drawerToggleButton}
        {toolbar}
      </nav>
      <aside className={clsx({
        [styles.drawer]: true,
        [styles.drawerOpen]: open
      })}>
        <nav className={styles.toolbar}>
          {drawerToggleButton}
        </nav>
        {drawer}
      </aside>
      <main className={styles.content}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            {crumbs.map(crumb => <Link className={styles.breadcrumb} {...crumb} />)}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
