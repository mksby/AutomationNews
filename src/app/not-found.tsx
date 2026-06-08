import Link from "next/link";
import styles from "./status.module.scss";

export const metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <p className={styles.kicker}>404</p>
      <h1 className={styles.title}>Not found</h1>
      <p className={styles.lede}>That URL doesn&apos;t lead anywhere.</p>
      <Link href="/" className={styles.link}>
        ← Back to the dispatch
      </Link>
    </main>
  );
}
