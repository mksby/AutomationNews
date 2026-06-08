import { NextResponse, type NextRequest } from "next/server";

/**
 * Advertise machine-readable resources via the HTTP Link header.
 *
 * RFC 8288 link relations exposed on every HTML response:
 *   - sitemap          (rel="sitemap")
 *   - RSS              (rel="alternate"; type=application/rss+xml)
 *   - JSON Feed        (rel="alternate"; type=application/feed+json)
 *   - llms.txt         (rel="llms")
 *   - api-catalog      (RFC 9727)
 *
 * Agents that don't parse HTML can discover these by reading headers alone.
 *
 * Stage 5 adds CSP, HSTS, and the rest of the security header set.
 */

const LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"',
  '</rss>; rel="alternate"; type="application/rss+xml"; title="RSS"',
  '</feed.json>; rel="alternate"; type="application/feed+json"; title="JSON Feed"',
  '</llms.txt>; rel="llms"; type="text/markdown"',
  '</.well-known/api-catalog>; rel="api-catalog"',
].join(", ");

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  // Rewrite /posts/<slug>.md → /api/post-source/<slug>. We cannot host a
  // dynamic segment with a literal `.md` suffix in App Router, so the public
  // URL is shaped here and the route handler lives at /api/post-source/[slug].
  if (url.pathname.startsWith("/posts/") && url.pathname.endsWith(".md")) {
    const slug = url.pathname.slice("/posts/".length, -3);
    if (slug && !slug.includes("/")) {
      const rewritten = url.clone();
      rewritten.pathname = `/api/post-source/${slug}`;
      const res = NextResponse.rewrite(rewritten);
      res.headers.set("link", LINK_HEADER);
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set("link", LINK_HEADER);
  return res;
}

// Cover every page-like response; skip Next's static asset pipeline.
export const config = {
  matcher: [
    /*
     * Match everything except:
     *  - /_next/ (static, image-opt)
     *  - /static/ (rarely used)
     *  - favicon
     */
    "/((?!_next/|static/|favicon.ico).*)",
  ],
};
