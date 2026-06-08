import { getArticles, getCategories } from "@/lib/content";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — a curated markdown index for LLM/agent consumption.
 *
 * NOTE: llms.txt is *discovery and curation*, not access control. The
 * Allow/Disallow contract for AI crawlers lives in robots.ts; the WAF
 * blocks non-compliant ones.
 */
export async function GET() {
  const articles = getArticles().slice(0, 30);
  const categories = getCategories();

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push("");
  lines.push(
    `Site root: ${SITE_URL} · RSS: ${absoluteUrl("/rss")} · JSON Feed: ${absoluteUrl("/feed.json")} · Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  );
  lines.push("");
  lines.push("Per-article raw markdown is available at `/posts/<slug>.md`.");
  lines.push("");

  lines.push("## Recent articles");
  lines.push("");
  for (const a of articles) {
    lines.push(
      `- [${a.title}](${absoluteUrl(a.url)}) — ${a.description} (markdown: ${absoluteUrl(`/posts/${a.slug}.md`)})`,
    );
  }
  lines.push("");

  lines.push("## Categories");
  lines.push("");
  for (const c of categories) {
    lines.push(`- [${c.name}](${absoluteUrl(`/${c.slug}`)}) — ${c.description}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
