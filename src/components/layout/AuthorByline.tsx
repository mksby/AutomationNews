import type { Author } from "@/lib/content";
import styles from "./AuthorByline.module.scss";

export function AuthorByline({ author }: { author: Author }) {
  return (
    <p className={styles.byline}>
      <span className={styles.label}>By</span>
      <span className={styles.name}>{author.name}</span>
    </p>
  );
}
