// Lowercases and strips accents (NFD splits "é" into "e" + a combining mark,
// then the combining-mark range U+0300–U+036F is removed).
import type { Title } from "../types";

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

const normalize = (text: string): string =>
  text.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "").trim();

// TMDB matches words but barely weighs popularity, so a short query like
// "godf" can list obscure titles first. Each result gets a text score (how
// well the title matches what was typed) plus a popularity score from votes,
// so well-known titles that match win over unknown exact matches.
const textScore = (title: string, q: string): number => {
  if (title === q) return 3;
  if (title.startsWith(q)) return 2.5;
  if (title.split(/[\s:-]+/).some((word) => word.startsWith(q))) return 1.5;
  if (title.includes(q)) return 0.5;
  return 0;
};

export const rankByRelevance = <T extends Pick<Title, "title" | "vote_count" | "popularity">>(
  items: T[],
  query: string
): T[] => {
  const q = normalize(query);
  const score = (item: T) =>
    textScore(normalize(item.title ?? ""), q) +
    1.2 * Math.log10(1 + (item.vote_count ?? 0)) +
    0.5 * Math.log10(1 + (item.popularity ?? 0));
  return items
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
};

// Splits a title into parts so the typed text can be highlighted.
export interface MatchPart {
  text: string;
  match: boolean;
}

export const splitMatch = (text: string, query: string): MatchPart[] => {
  const q = query.trim();
  if (!q) return [{ text, match: false }];
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return [{ text, match: false }];
  return [
    { text: text.slice(0, i), match: false },
    { text: text.slice(i, i + q.length), match: true },
    { text: text.slice(i + q.length), match: false },
  ].filter((part) => part.text);
};
