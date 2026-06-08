/**
 * Speculation Rules — opportunistically prefetch in-document links the
 * user is likely to visit. Browsers without support ignore the script.
 */
export function SpeculationRules() {
  const rules = {
    prerender: [
      {
        source: "document",
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: "/api/*" } },
            { not: { href_matches: "/posts/*.md" } },
            { not: { href_matches: "/feed.json" } },
            { not: { href_matches: "/rss" } },
            { not: { selector_matches: "[rel=external]" } },
          ],
        },
        eagerness: "moderate",
      },
    ],
  };
  return (
    <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }} />
  );
}
