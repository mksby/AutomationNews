import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * RFC 9727 API Catalog (linkset JSON) — points agents at the
 * machine-readable surfaces of the site.
 */
export async function GET() {
  const linkset = {
    linkset: [
      {
        anchor: absoluteUrl("/"),
        item: [
          {
            href: absoluteUrl("/llms.txt"),
            type: "text/markdown",
            title: "LLM-curated index",
          },
          {
            href: absoluteUrl("/sitemap.xml"),
            type: "application/xml",
            title: "Sitemap",
          },
          {
            href: absoluteUrl("/rss"),
            type: "application/rss+xml",
            title: "RSS",
          },
          {
            href: absoluteUrl("/feed.json"),
            type: "application/feed+json",
            title: "JSON Feed",
          },
          {
            href: absoluteUrl("/posts/{slug}.md"),
            type: "text/markdown",
            title: "Per-article raw markdown (templated)",
            templated: true,
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "content-type": "application/linkset+json",
      "cache-control": "public, max-age=3600",
    },
  });
}
