import { getArticles, getAuthor } from "@/lib/content";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * JSON Feed 1.1 — https://www.jsonfeed.org/version/1.1/
 * Agent-friendly mirror of /rss. Linked via the Link header on every
 * response (see middleware.ts).
 */
export async function GET() {
  const articles = getArticles();
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    home_page_url: SITE_URL,
    feed_url: absoluteUrl("/feed.json"),
    description: SITE_DESCRIPTION,
    language: "en-US",
    items: articles.map((a) => {
      const author = getAuthor(a.author);
      return {
        id: absoluteUrl(a.url),
        url: absoluteUrl(a.url),
        title: a.title,
        summary: a.description,
        content_text: a.description,
        date_published: new Date(a.date).toISOString(),
        date_modified: a.updated
          ? new Date(a.updated).toISOString()
          : new Date(a.date).toISOString(),
        authors: author ? [{ name: author.name, url: author.url }] : undefined,
        tags: [a.category, ...a.tags],
        // Per-page raw markdown source, advertised here too so agents can
        // skip parsing HTML.
        attachments: [
          {
            url: absoluteUrl(`/posts/${a.slug}.md`),
            mime_type: "text/markdown",
            title: "Source markdown",
          },
        ],
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "content-type": "application/feed+json; charset=utf-8",
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
