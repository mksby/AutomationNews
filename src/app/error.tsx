"use client";

import { useEffect } from "react";
import styles from "./status.module.scss";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hand-off to whatever observability sink we wire up later.
    console.error(error);
  }, [error]);

  return (
    <main id="main" className={styles.page}>
      <p className={styles.kicker}>500</p>
      <h1 className={styles.title}>Something broke.</h1>
      <p className={styles.lede}>
        An unexpected error reached the server. The team has been notified.
      </p>
      {error.digest ? <p className={styles.digest}>Reference: {error.digest}</p> : null}
      <button type="button" onClick={() => reset()} className={styles.button}>
        Try again
      </button>
    </main>
  );
}
