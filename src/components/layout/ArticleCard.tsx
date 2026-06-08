import Link from "next/link";
import type { Article } from "@/lib/content";
import { getCategory } from "@/lib/content";
import { ArticleMeta } from "./ArticleMeta";
import { Chip } from "./Chip";
import styles from "./ArticleCard.module.scss";

export function ArticleCard({ article }: { article: Article }) {
  const category = getCategory(article.category);
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <ArticleMeta date={article.date} readingTime={article.readingTime} category={category} />
      </header>
      <h2 className={styles.title}>
        <Link href={article.url} className={styles.link}>
          {article.title}
        </Link>
      </h2>
      <p className={styles.description}>{article.description}</p>
      {article.tags.length > 0 ? (
        <ul className={styles.tags} aria-label="Tags">
          {article.tags.map((tag) => (
            <li key={tag}>
              <Chip href={`/tags/${tag}`}>{tag}</Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
