import Link from "next/link";
import styles from "./SiteFooter.module.scss";

const machineReadable: { label: string; href: string; type?: string }[] = [
  { label: "RSS", href: "/rss" },
  { label: "JSON Feed", href: "/feed.json" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "llms.txt", href: "/llms.txt" },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.tagline}>
          News and analysis on industrial, business-process, RPA and AI automation.
        </p>
        <nav aria-label="Machine-readable feeds" className={styles.feeds}>
          <span className={styles.label}>For agents:</span>
          <ul className={styles.feedList}>
            {machineReadable.map((f) => (
              <li key={f.href}>
                <Link href={f.href} className={styles.feedLink}>
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.legal}>
          © {new Date().getUTCFullYear()} automation.news ·{" "}
          <Link href="/privacy" className={styles.legalLink}>
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
