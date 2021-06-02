import { createStore } from "@propero/easy-store";
import { LinkProps } from "react-router-dom";

export interface Breadcrumb extends LinkProps {
  key: string;
}

export const breadcrumbs = createStore<Breadcrumb[]>([]);
