import Link from "next/link";
import styles from "./Pagination.module.scss";

type Props = {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export function Pagination({ prev, next }: Props) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {prev ? (
        <Link href={prev.href} rel="prev" className={`${styles.link} ${styles.prev}`}>
          <span aria-hidden="true">←</span>
          <span>{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} rel="next" className={`${styles.link} ${styles.next}`}>
          <span>{next.label}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
