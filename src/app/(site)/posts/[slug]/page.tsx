import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { Prose } from "@/components/mdx/Prose";
import { ArticleHeader } from "@/components/layout/ArticleHeader";
import { Chip } from "@/components/layout/Chip";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleBySlug, getArticles, getAuthor, getCategory, type Article } from "@/lib/content";
import { SITE_NAME, SITE_PUBLISHER, SITE_URL, absoluteUrl } from "@/lib/site";
import styles from "./article.module.scss";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not found", robots: { index: false } };
  const canonical = absoluteUrl(article.url);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: SITE_NAME,
      publishedTime: article.date,
      modifiedTime: article.updated,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

function relatedArticles(current: Article, limit = 3): Article[] {
  return getArticles()
    .filter((a) => a.slug !== current.slug)
    .filter((a) => a.category === current.category || a.tags.some((t) => current.tags.includes(t)))
    .slice(0, limit);
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const author = getAuthor(article.author);
  const related = relatedArticles(article);

  const newsArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(article.url) },
    inLanguage: "en",
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: SITE_PUBLISHER,
    articleSection: category?.name,
    keywords: article.tags.join(", "),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      category
        ? {
            "@type": "ListItem",
            position: 2,
            name: category.name,
            item: absoluteUrl(`/${category.slug}`),
          }
        : null,
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: article.title,
        item: absoluteUrl(article.url),
      },
    ].filter(Boolean),
  };

  const crumbs = [
    { label: "Home", href: "/" },
    ...(category ? [{ label: category.name, href: `/${category.slug}` }] : []),
    { label: article.title },
  ];

  return (
    <main id="main" className={styles.page}>
      <JsonLd data={newsArticle} />
      <JsonLd data={breadcrumbs} />
      <Breadcrumbs crumbs={crumbs} />
      <article className={styles.article}>
        <ArticleHeader article={article} />
        <Prose>
          <MDXContent code={article.body} components={mdxComponents} />
        </Prose>
        {article.tags.length > 0 ? (
          <footer className={styles.tagFooter}>
            <ul className={styles.tagList} aria-label="Tags">
              {article.tags.map((t) => (
                <li key={t}>
                  <Chip href={`/tags/${t}`}>{t}</Chip>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>
      {related.length > 0 ? (
        <aside className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading" className={styles.relatedHeading}>
            Related
          </h2>
          <ul className={styles.relatedList}>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={r.url} className={styles.relatedLink}>
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  );
}
