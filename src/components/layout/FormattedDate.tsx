const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function FormattedDate({ iso }: { iso: string }) {
  const date = new Date(iso);
  return <time dateTime={iso}>{DATE_FORMATTER.format(date)}</time>;
}
