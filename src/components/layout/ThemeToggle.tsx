"use client";

import { useEffect, useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.scss";

type Theme = "dark" | "light";

const STORAGE_KEY = "automation-news:theme";

function readPreferredTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function subscribe(callback: () => void): () => void {
  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): Theme | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function getServerSnapshot(): Theme | null {
  return null;
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme === "light" ? "light" : "";
}

export function ThemeToggle() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Server render and the very first client render both see null — they agree,
  // so no hydration mismatch. After hydration the effect picks the actual value.
  const current: Theme | null = stored;

  useEffect(() => {
    applyTheme(current ?? readPreferredTheme());
  }, [current]);

  if (current === null) {
    return <span className={styles.toggle} aria-hidden="true" />;
  }

  const toggle = () => {
    const next: Theme = current === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    // `storage` events don't fire in the same tab — nudge the store ourselves.
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Switch to ${current === "dark" ? "light" : "dark"} theme`}
      title={`Theme: ${current}`}
    >
      <span className={styles.label}>{current === "dark" ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
