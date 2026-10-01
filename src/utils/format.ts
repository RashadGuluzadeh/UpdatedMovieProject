import type { TranslateFn } from "../i18n/context";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// TMDB dates are "YYYY-MM-DD" (sometimes empty). Shown in the reader's
// language, e.g. "5 Nov 2014" / "5 Kas 2014" / "5 нояб. 2014". Parsed as UTC
// so the day never shifts with the visitor's time zone.
export const formatDate = (date: string | null | undefined, locale = "en-US"): string =>
  typeof date === "string" && DATE_PATTERN.test(date)
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00Z`))
    : "—";

export const formatRating = (vote: number | null | undefined): string =>
  typeof vote === "number" ? vote.toFixed(1) : "—";

export const formatYear = (date: string | null | undefined): string =>
  typeof date === "string" && date.length >= 4 ? date.slice(0, 4) : "";

export const formatMoney = (amount: number | null | undefined, locale = "en-US"): string | null =>
  typeof amount === "number" && amount > 0
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount)
    : null;

// `t` supplies the localized "{h}h {m}m" / "{m}m" patterns.
export const formatRuntime = (minutes: number | null | undefined, t: TranslateFn): string | null => {
  if (typeof minutes !== "number" || !Number.isInteger(minutes) || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? t("title.runtimeHm", { h, m }) : t("title.runtimeM", { m });
};
