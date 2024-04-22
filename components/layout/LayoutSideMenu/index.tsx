"use client";

import Link from "next/link";
import { ReactNode } from "react";

import clsx from "clsx";

import styles from "./index.module.css";

const sideMenuItem: {
  id: string;
  menuText: string;
  url: string;
}[] = [
  {
    id: "1",
    menuText: "メニュー１",
    url: "/",
  },
  {
    id: "2",
    menuText: "メニュー2",
    url: "/",
  },

  {
    id: "3",
    menuText: "メニュー3",
    url: "/",
  },
];

export const LayoutSideMenu = () => {
  return (
    <nav id="sidebarMenu" className={clsx(styles["sidemenu"])}>
      <ul>
        {sideMenuItem.map((item) => (
          <li key={item.id}>
            <Link href={item.url}>{item.menuText}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
