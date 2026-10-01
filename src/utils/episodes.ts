import type { Episode, EpisodeWithDelta } from "../types";

export const episodeCode = (e: Pick<Episode, "season" | "number">): string =>
  `S${e.season}·E${String(e.number).padStart(2, "0")}`;

// Adds the change from the previous rated episode (across season breaks).
export const withDeltas = (episodes: Episode[]): EpisodeWithDelta[] => {
  let previous: number | null = null;
  return episodes.map((e) => {
    const delta = e.rating !== null && previous !== null ? e.rating - previous : null;
    if (e.rating !== null) previous = e.rating;
    return { ...e, delta };
  });
};

export const average = (values: number[]): number | null =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
