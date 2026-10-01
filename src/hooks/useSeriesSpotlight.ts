import { getSeriesSpotlight } from "../api/tmdb";
import { useI18n } from "../i18n/context";
import { useCollection } from "./useCollection";
import { createCache, useCachedRequest } from "./useCachedRequest";
import type { SeriesSpotlight } from "../types";

export type SpotlightStatus = "loading" | "succeeded" | "empty" | "failed";

// The spotlight takes several requests, so it is built once per language.
const cache = createCache<SeriesSpotlight | null>();

// Picks a top rated trending series and loads its per-episode ratings.
// status: loading | succeeded | empty (no suitable series) | failed
export const useSeriesSpotlight = (): { status: SpotlightStatus; data: SeriesSpotlight | null } => {
  const { lang } = useI18n();
  const trending = useCollection("tv", "trending");
  const ready = trending.status === "succeeded";
  const { status, data } = useCachedRequest(cache, ready ? lang : null, (signal) =>
    getSeriesSpotlight(trending.items, { signal })
  );

  if (trending.status === "failed" || status === "failed") return { status: "failed", data: null };
  if (status === "succeeded") return { status: data ? "succeeded" : "empty", data: data ?? null };
  return { status: "loading", data: null };
};
