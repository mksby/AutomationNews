import { FormattedDate } from "./FormattedDate";
import styles from "./ArticleMeta.module.scss";

type Props = {
  date: string;
  readingTime?: number;
  category?: { slug: string; name: string };
  className?: string;
};

export function ArticleMeta({ date, readingTime, category, className }: Props) {
  return (
    <div className={`${styles.meta} ${className ?? ""}`.trim()}>
      <FormattedDate iso={date} />
      {category ? (
        <>
          <span aria-hidden="true" className={styles.sep}>
            ·
          </span>
          <span>{category.name}</span>
        </>
      ) : null}
      {readingTime ? (
        <>
          <span aria-hidden="true" className={styles.sep}>
            ·
          </span>
          <span>{readingTime} min read</span>
        </>
      ) : null}
    </div>
  );
}
