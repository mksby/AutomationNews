import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/layout/ArticleCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllTags, getArticlesByTag } from "@/lib/content";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "../../feed.module.scss";

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  const articles = getArticlesByTag(tag);
  if (articles.length === 0) return { title: "Not found", robots: { index: false } };
  const title = `#${tag}`;
  return {
    title,
    description: `Articles tagged ${tag} on ${SITE_NAME}.`,
    alternates: { canonical: absoluteUrl(`/tags/${tag}`) },
    openGraph: {
      type: "website",
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(`/tags/${tag}`),
      siteName: SITE_NAME,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const articles = getArticlesByTag(tag);
  if (articles.length === 0) notFound();

  return (
    <main id="main" className={styles.page}>
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tags", href: "/tags" },
          { label: `#${tag}` },
        ]}
      />
      <header className={styles.intro}>
        <p className={styles.kicker}>Tag</p>
        <h1 className={styles.title}>#{tag}</h1>
      </header>
      <section aria-label="Articles" className={styles.feed}>
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </section>
    </main>
  );
}
