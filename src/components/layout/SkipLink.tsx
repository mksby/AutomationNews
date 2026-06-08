import styles from "./SkipLink.module.scss";

export function SkipLink() {
  return (
    <a href="#main" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
