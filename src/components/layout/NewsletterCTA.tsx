import styles from "./NewsletterCTA.module.scss";

/**
 * Placeholder — no real subscription wired up yet. When implemented:
 *   - real <form action> with server action / API route
 *   - <label> programmatically linked (not placeholder-as-label)
 *   - input type="email" inputmode="email" enterkeyhint="send"
 *   - font-size ≥ 16px on the input (iOS no-zoom)
 *   - server validation; error messages programmatically associated
 */
export function NewsletterCTA() {
  return (
    <section className={styles.cta} aria-labelledby="newsletter-heading">
      <div className={styles.copy}>
        <p className={styles.label}>Newsletter</p>
        <h2 id="newsletter-heading" className={styles.title}>
          Get the weekly dispatch.
        </h2>
        <p className={styles.lede}>
          One email on Fridays. The week&apos;s automation news, curated and annotated.
        </p>
      </div>
      <form className={styles.form} action="#" method="post" aria-describedby="newsletter-note">
        <label htmlFor="newsletter-email" className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            enterKeyHint="send"
            autoComplete="email"
            placeholder="you@domain.com"
            required
            disabled
            className={styles.input}
          />
        </label>
        <button type="submit" disabled className={styles.button}>
          Subscribe
        </button>
        <p id="newsletter-note" className={styles.note}>
          Wiring pending — this is a placeholder.
        </p>
      </form>
    </section>
  );
}
