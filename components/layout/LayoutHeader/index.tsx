import Link from "next/link";
import clsx from "clsx";

import styles from "./index.module.css";

export const LayoutHeader = () => {
  return (
    <header className={clsx(styles["site-header"])}>
      <div className={clsx(styles["site-header__wrapper"])}>
        <a href="#" className={clsx(styles["brand"])}>
          Brand
        </a>
        <nav className={clsx(styles["nav"])}>
          <button
            className={clsx(styles["nav__toggle"])}
            aria-expanded="false"
            type="button"
          >
            menu
          </button>
          <ul className={clsx(styles["nav__wrapper"])}>
            <li className={clsx(styles["nav__item"])}>
              <a href="#">Home</a>
            </li>
            <li className={clsx(styles["nav__item"])}>
              <a href="#">About</a>
            </li>
            <li className={clsx(styles["nav__item"])}>
              <a href="#">Services</a>
            </li>
            <li className={clsx(styles["nav__item"])}>
              <a href="#">Hire us</a>
            </li>
            <li className={clsx(styles["nav__item"])}>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
