import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { getCategories } from "@/lib/content";
import styles from "./SiteHeader.module.scss";

export function SiteHeader() {
  const categories = getCategories();
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label="automation.news, home">
          <span className={styles.brand}>automation</span>
          <span className={styles.dot}>.</span>
          <span className={styles.tail}>news</span>
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <ul className={styles.navList}>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className={styles.navLink}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
