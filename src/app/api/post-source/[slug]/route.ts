import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/content";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

/**
 * Internal endpoint that emits the raw markdown source of an article.
 * The public URL is `/posts/<slug>.md` — the proxy rewrites to here.
 * App Router does not allow a literal extension on a dynamic segment,
 * so the rewrite is the only clean way to keep the friendly URL.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(article.title)}`,
    `description: ${JSON.stringify(article.description)}`,
    `date: ${article.date}`,
    `category: ${article.category}`,
    `tags: [${article.tags.join(", ")}]`,
    `author: ${article.author}`,
    "---",
    "",
  ].join("\n");

  const body = frontmatter + article.content;

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
