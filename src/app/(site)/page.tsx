import { ArticleCard } from "@/components/layout/ArticleCard";
import { NewsletterCTA } from "@/components/layout/NewsletterCTA";
import { getArticles } from "@/lib/content";
import styles from "./feed.module.scss";

export default function Home() {
  const articles = getArticles();
  return (
    <main id="main" className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Dispatch</p>
        <h1 className={styles.title}>
          News and analysis on industrial,
          <br /> business-process, RPA and AI automation.
        </h1>
      </header>
      <section aria-label="Articles" className={styles.feed}>
        {articles.length === 0 ? (
          <p className={styles.empty}>No articles yet.</p>
        ) : (
          articles.map((a) => <ArticleCard key={a.slug} article={a} />)
        )}
      </section>
      <NewsletterCTA />
    </main>
  );
}
