/**
 * Server-rendered JSON-LD. Keep payloads small and stable so they're
 * inlined into the SSG HTML — agents that don't parse JS still see them.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // We control the input; serializer escapes the inner </script> sentinel.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
