import type { MetadataRoute } from "next";
import { getAllTags, getArticles, getCategories } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

// At <50k URLs a single sitemap is enough — no sitemap index needed.
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const latestArticle = articles[0]?.updated ?? articles[0]?.date;

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latestArticle ? new Date(latestArticle) : new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  for (const c of getCategories()) {
    entries.push({
      url: absoluteUrl(`/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const t of getAllTags()) {
    entries.push({
      url: absoluteUrl(`/tags/${t}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  for (const a of articles) {
    entries.push({
      url: absoluteUrl(a.url),
      lastModified: new Date(a.updated ?? a.date),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
