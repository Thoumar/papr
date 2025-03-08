import Link from "next/link";

import clsx from "clsx";

import styles from "./not-found.module.sass";

export default function NotFound() {
  return (
    <div className={clsx([styles.notFound])}>
      <h1>Cette page n&apos;existe pas</h1>
      <p>
        Retournez à la <Link href="/">page d&apos;accueil</Link>
      </p>
    </div>
  );
}
