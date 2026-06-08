import fs from "node:fs/promises";
import path from "node:path";
import { ArticleCard } from "@/components/layout/ArticleCard";
import { ArticleHeader } from "@/components/layout/ArticleHeader";
import { Chip } from "@/components/layout/Chip";
import { Pagination } from "@/components/layout/Pagination";
import { Callout } from "@/components/layout/Callout";
import { NewsletterCTA } from "@/components/layout/NewsletterCTA";
import { ArticleMeta } from "@/components/layout/ArticleMeta";
import { AuthorByline } from "@/components/layout/AuthorByline";
import { getArticles, getAuthor } from "@/lib/content";
import styles from "./styleguide.module.scss";

type TokenEntry = { name: string; value: unknown; description?: string };

async function loadTokenTables(): Promise<Record<string, TokenEntry[]>> {
  const root = path.join(process.cwd(), "tokens");
  const files = [
    "primitive/color.tokens.json",
    "primitive/dimension.tokens.json",
    "primitive/typography.tokens.json",
    "primitive/motion.tokens.json",
    "semantic.dark.tokens.json",
    "component/card.tokens.json",
  ];
  const tables: Record<string, TokenEntry[]> = {};
  for (const file of files) {
    const raw = await fs.readFile(path.join(root, file), "utf8");
    const json = JSON.parse(raw) as Record<string, unknown>;
    const label = file.replace(".tokens.json", "");
    tables[label] = flatten(json);
  }
  return tables;
}

function flatten(node: unknown, prefix: string[] = []): TokenEntry[] {
  if (node && typeof node === "object" && "$value" in (node as Record<string, unknown>)) {
    const n = node as { $value: unknown; $description?: string };
    return [
      {
        name: `--${prefix.join("-")}`,
        value: n.$value,
        description: n.$description,
      },
    ];
  }
  if (!node || typeof node !== "object") return [];
  const out: TokenEntry[] = [];
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (k.startsWith("$")) continue;
    out.push(...flatten(v, [...prefix, k]));
  }
  return out;
}

function valueText(v: unknown): string {
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.join(", ");
  if (v && typeof v === "object") {
    return Object.entries(v)
      .map(([k, val]) => `${k}: ${val}`)
      .join("; ");
  }
  return String(v);
}

export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: true },
};

export default async function StyleguidePage() {
  const articles = getArticles().slice(0, 2);
  const tables = await loadTokenTables();
  const editorial = getAuthor("editorial");

  return (
    <main id="main" className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Internal</p>
        <h1 className={styles.title}>Styleguide</h1>
        <p className={styles.lede}>
          Living catalogue of components and tokens. Auto-generated from <code>tokens/</code>
          and rendered against the live design system.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="tokens">
        <h2 id="tokens" className={styles.h2}>
          Tokens
        </h2>
        {Object.entries(tables).map(([group, entries]) => (
          <details key={group} className={styles.group} open={group.startsWith("semantic")}>
            <summary className={styles.summary}>
              {group}{" "}
              <span className={styles.count}>
                ({entries.length} token{entries.length === 1 ? "" : "s"})
              </span>
            </summary>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Value</th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.name}>
                    <td>
                      <code>{e.name}</code>
                    </td>
                    <td>
                      <code>{valueText(e.value)}</code>
                    </td>
                    <td>{e.description ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="components">
        <h2 id="components" className={styles.h2}>
          Components
        </h2>

        <div className={styles.grid2}>
          <div>
            <h3 className={styles.h3}>Chip</h3>
            <div className={styles.row}>
              <Chip>neutral</Chip>
              <Chip tone="accent">accent</Chip>
              <Chip href="/ai">link</Chip>
            </div>
          </div>
          <div>
            <h3 className={styles.h3}>ArticleMeta</h3>
            <ArticleMeta date="2026-01-15" readingTime={4} category={{ slug: "ai", name: "AI" }} />
          </div>
        </div>

        {editorial ? (
          <div className={styles.block}>
            <h3 className={styles.h3}>AuthorByline</h3>
            <AuthorByline author={editorial} />
          </div>
        ) : null}

        <div className={styles.block}>
          <h3 className={styles.h3}>ArticleCard</h3>
          <div className={styles.cardGrid}>
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>

        {articles[0] ? (
          <div className={styles.block}>
            <h3 className={styles.h3}>ArticleHeader</h3>
            <ArticleHeader article={articles[0]} />
          </div>
        ) : null}

        <div className={styles.block}>
          <h3 className={styles.h3}>Callout</h3>
          <Callout title="Note">A neutral note inside an article.</Callout>
          <Callout variant="warn" title="Warning">
            Higher-emphasis annotation.
          </Callout>
        </div>

        <div className={styles.block}>
          <h3 className={styles.h3}>NewsletterCTA</h3>
          <NewsletterCTA />
        </div>

        <div className={styles.block}>
          <h3 className={styles.h3}>Pagination</h3>
          <Pagination
            prev={{ href: "#prev", label: "Previous" }}
            next={{ href: "#next", label: "Next" }}
          />
        </div>
      </section>
    </main>
  );
}
