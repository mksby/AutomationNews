import styles from "./Callout.module.scss";

type Variant = "info" | "warn";

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={`${styles.callout} ${variant === "warn" ? styles.warn : ""}`.trim()}>
      {title ? <p className={styles.title}>{title}</p> : null}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
