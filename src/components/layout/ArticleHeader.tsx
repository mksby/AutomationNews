import type { Article } from "@/lib/content";
import { getAuthor, getCategory } from "@/lib/content";
import { ArticleMeta } from "./ArticleMeta";
import { AuthorByline } from "./AuthorByline";
import { Chip } from "./Chip";
import styles from "./ArticleHeader.module.scss";

export function ArticleHeader({ article }: { article: Article }) {
  const author = getAuthor(article.author);
  const category = getCategory(article.category);
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {category ? (
          <Chip href={`/${category.slug}`} tone="accent">
            {category.name}
          </Chip>
        ) : null}
        <ArticleMeta date={article.date} readingTime={article.readingTime} />
      </div>
      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.lede}>{article.description}</p>
      {author ? <AuthorByline author={author} /> : null}
    </header>
  );
}
