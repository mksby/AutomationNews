import { getArticles, getAuthor } from "@/lib/content";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc2822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET() {
  const articles = getArticles();
  const lastBuild = articles[0]?.date ?? new Date().toISOString();

  const items = articles
    .map((a) => {
      const author = getAuthor(a.author);
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(absoluteUrl(a.url))}</link>
      <guid isPermaLink="true">${escapeXml(absoluteUrl(a.url))}</guid>
      <pubDate>${rfc2822(a.date)}</pubDate>
      <description>${escapeXml(a.description)}</description>
      ${author ? `<dc:creator>${escapeXml(author.name)}</dc:creator>` : ""}
      <category>${escapeXml(a.category)}</category>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
    <lastBuildDate>${rfc2822(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/rss"))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
