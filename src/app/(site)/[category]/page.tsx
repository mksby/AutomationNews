import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/layout/ArticleCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getArticlesByCategory, getCategories, getCategory } from "@/lib/content";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "../feed.module.scss";

type Params = { category: string };

// Reserved top-level routes that must not be intercepted by /[category].
const RESERVED = new Set([
  "posts",
  "tags",
  "styleguide",
  "privacy",
  "rss",
  "robots.txt",
  "sitemap.xml",
  "feed.json",
  "llms.txt",
]);

export async function generateStaticParams(): Promise<Params[]> {
  return getCategories()
    .filter((c) => !RESERVED.has(c.slug))
    .map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Not found", robots: { index: false } };
  return {
    title: c.name,
    description: c.description,
    alternates: { canonical: absoluteUrl(`/${c.slug}`) },
    openGraph: {
      type: "website",
      title: `${c.name} · ${SITE_NAME}`,
      description: c.description,
      url: absoluteUrl(`/${c.slug}`),
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  if (RESERVED.has(category)) notFound();
  const c = getCategory(category);
  if (!c) notFound();
  const articles = getArticlesByCategory(c.slug);

  return (
    <main id="main" className={styles.page}>
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: c.name }]} />
      <header className={styles.intro}>
        <p className={styles.kicker}>Category</p>
        <h1 className={styles.title}>{c.name}</h1>
        <p className={styles.lede}>{c.description}</p>
      </header>
      <section aria-label="Articles" className={styles.feed}>
        {articles.length === 0 ? (
          <p className={styles.empty}>No articles in this category yet.</p>
        ) : (
          articles.map((a) => <ArticleCard key={a.slug} article={a} />)
        )}
      </section>
    </main>
  );
}
