import type { MetadataRoute } from "next";
import { absoluteUrl, IS_PREVIEW } from "@/lib/site";

/**
 * AI-crawler policy. Newsroom rationale: we want visibility (citations,
 * search results) more than we fear training. Keep this file under
 * **quarterly review** — the named UA list shifts as new agents launch
 * and existing ones rename.
 *
 * Off-list crawlers that ignore robots.txt (e.g. Bytespider) are not the
 * job of this file — they are blocked at the WAF / Vercel Firewall edge.
 *
 * Toggle the "training" block by setting AI_TRAINING_DISALLOW=1 in env.
 */

const SEARCH_AND_CITATION_BOTS = [
  // OpenAI
  "OAI-SearchBot",
  "ChatGPT-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
];

const TRAINING_BOTS = [
  "GPTBot", // OpenAI
  "ClaudeBot", // Anthropic
  "Google-Extended", // Google
  "Applebot-Extended", // Apple
  "CCBot", // Common Crawl
  "Amazonbot", // Amazon
];

const TRAINING_DISALLOWED = process.env.AI_TRAINING_DISALLOW === "1";

export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) {
    // Preview / staging environments are noindex regardless of UA.
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/" },
    ...SEARCH_AND_CITATION_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ...TRAINING_BOTS.map((ua) =>
      TRAINING_DISALLOWED ? { userAgent: ua, disallow: "/" } : { userAgent: ua, allow: "/" },
    ),
  ];

  return {
    rules,
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
