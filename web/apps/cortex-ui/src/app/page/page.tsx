import { Breadcrumb } from "../../store/breadcrumbs";
import React, { ReactNode, ReactNodeArray, useState } from "react";
import { Link } from "react-router-dom";
import styles from './page.module.css';

export interface PageProps {
  children: ReactNode | ReactNodeArray;
  toolbar: ReactNode | ReactNodeArray;
  crumbs: Breadcrumb[];
}

export function Page({ children, toolbar, crumbs } : PageProps) {
  return (
    <div className={styles.app}>
      <nav className={styles.toolbar}>
        {toolbar}
      </nav>
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
