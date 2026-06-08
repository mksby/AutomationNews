"use client";

/**
 * Last-resort fallback when a root-layout error escapes. Must declare
 * its own <html>/<body> because the root layout is the thing that failed.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#16171B",
          color: "#E8E6E1",
          fontFamily: "ui-monospace, monospace",
          padding: "2rem",
          margin: 0,
        }}
      >
        <h1 style={{ marginTop: 0 }}>500 — something broke.</h1>
        <p>An unrecoverable error reached the server.</p>
        {error.digest ? <p>Reference: {error.digest}</p> : null}
        <p>
          {/* The root layout has failed — using a plain <a> is intentional so
              navigation works even when next/link's runtime is unavailable. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#F5A623" }}>
            ← back to home
          </a>
        </p>
      </body>
    </html>
  );
}
