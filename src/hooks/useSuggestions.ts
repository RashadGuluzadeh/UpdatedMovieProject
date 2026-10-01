import { searchTitles } from "../api/tmdb";
import { rankByRelevance } from "../utils/search";
import { useI18n } from "../i18n/context";
import { createCache, useCachedRequest } from "./useCachedRequest";
import type { MediaType, RequestStatus, Title } from "../types";

export const MIN_QUERY_CHARS = 2;
const MAX_SUGGESTIONS = 6;

// Recent lookups, so typing back and forth doesn't refetch.
const cache = createCache<Title[]>(50);

// Top matches for the search-as-you-type panel. While a new query loads, the
// previous suggestions are returned with `stale: true` so the list dims
// instead of flashing empty on every keystroke.
export interface Suggestions {
  status: RequestStatus;
  items: Title[];
  stale: boolean;
}

export const useSuggestions = (mediaType: MediaType, query: string): Suggestions => {
  const { lang } = useI18n();
  const enabled = query.length >= MIN_QUERY_CHARS;
  const key = enabled ? `${lang}:${mediaType}:${query.toLowerCase()}` : null;

  const { status, data, previous } = useCachedRequest(cache, key, async (signal) =>
    rankByRelevance(await searchTitles(mediaType, query, { signal }), query).slice(0, MAX_SUGGESTIONS)
  );

  if (status === "loading" && previous?.length) {
    return { status, items: previous, stale: true };
  }
  return { status, items: data ?? [], stale: false };
};
