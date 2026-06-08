/**
 * Single boundary between the content layer and the rest of the app.
 *
 * Every read of articles/authors/categories MUST go through this module.
 * App-level code (src/app/**) must not import from "content-collections"
 * directly — keeping the boundary lets us migrate to ISR/Cache Components
 * later (TODO when traffic crosses the static-budget threshold) without
 * touching the routes.
 */
import { allArticles, allAuthors, allCategories } from "content-collections";

export type Article = (typeof allArticles)[number];
export type Author = (typeof allAuthors)[number];
export type Category = (typeof allCategories)[number];

const IS_PROD = process.env.NODE_ENV === "production";

function hidesDrafts(): boolean {
  return IS_PROD;
}

function compareByDateDesc(a: Article, b: Article): number {
  return b.date.localeCompare(a.date);
}

function visibleArticles(): Article[] {
  const list = hidesDrafts() ? allArticles.filter((a) => !a.draft) : allArticles.slice();
  return list.sort(compareByDateDesc);
}

export function getArticles(): Article[] {
  return visibleArticles();
}

export function getArticleBySlug(slug: string): Article | undefined {
  return visibleArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return visibleArticles().filter((a) => a.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return visibleArticles().filter((a) => a.tags.includes(tag));
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return visibleArticles().filter((a) => a.author === authorSlug);
}

export function getAuthors(): Author[] {
  return allAuthors.slice();
}

export function getAuthor(slug: string): Author | undefined {
  return allAuthors.find((a) => a.slug === slug);
}

export function getCategories(): Category[] {
  return allCategories.slice();
}

export function getCategory(slug: string): Category | undefined {
  return allCategories.find((c) => c.slug === slug);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const article of visibleArticles()) {
    for (const tag of article.tags) set.add(tag);
  }
  return [...set].sort();
}
