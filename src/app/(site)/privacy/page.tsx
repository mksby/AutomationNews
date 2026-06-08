import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose } from "@/components/mdx/Prose";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "../posts/[slug]/article.module.scss";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy policy for ${SITE_NAME}.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <main id="main" className={styles.page}>
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <article className={styles.article}>
        <header>
          <h1>Privacy</h1>
          <p>
            <em>
              Last updated{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }).format(new Date("2026-01-15T00:00:00Z"))}
              .
            </em>
          </p>
        </header>
        <Prose>
          <h2>What we collect</h2>
          <p>
            Nothing that identifies you personally. {SITE_NAME} runs cookieless, privacy-respecting
            analytics — aggregate page-view counts only, no cross-site tracking, no fingerprinting,
            no persistent identifiers.
          </p>

          <h2>Cookies</h2>
          <p>
            We do not set any non-essential cookies. The only cookies that may be set are session
            cookies the platform uses for security purposes (e.g. CSRF protection on any future
            form). Because no tracking/marketing cookies are involved, no consent banner is
            required.
          </p>

          <h2>Server logs</h2>
          <p>
            Standard HTTP logs (IP, user-agent, requested URL, timestamp) are retained by our
            hosting provider for ~30 days for operational and abuse-prevention purposes. They are
            not joined to any other data.
          </p>

          <h2>Newsletter</h2>
          <p>
            The newsletter signup form is not yet wired. When it is, we will collect only your email
            address, use it to send the newsletter, and you may unsubscribe with one click. We will
            not sell or share it.
          </p>

          <h2>Third-party content</h2>
          <p>
            We do not embed third-party scripts or pixel trackers. External links in articles open
            in the same tab and we do not preload or prefetch their content.
          </p>

          <h2>Your rights</h2>
          <p>
            If we ever collect personal data, you will have the right to request a copy, request its
            deletion, or object to its processing. Contact:{" "}
            <a href="mailto:privacy@automation.news">privacy@automation.news</a>.
          </p>

          <h2>Changes</h2>
          <p>
            We will update this page if the practice changes. The version date above always reflects
            the most recent change.
          </p>
        </Prose>
      </article>
    </main>
  );
}
