import Link from "next/link";
import styles from "./Chip.module.scss";

type Tone = "neutral" | "accent";

export function Chip({
  href,
  children,
  tone = "neutral",
}: {
  href?: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  const className = `${styles.chip} ${tone === "accent" ? styles.accent : ""}`.trim();

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}
