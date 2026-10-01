import { getCollection, type CollectionKind } from "../api/tmdb";
import type { MediaType, RequestStatus, Title } from "../types";
import { useI18n } from "../i18n/context";
import { createCache, useCachedRequest } from "./useCachedRequest";

// Collections (trending, popular, top rated) change slowly, so each one is
// fetched once per language per session; switching pages reuses it.
const cache = createCache<Title[]>();

export const useCollection = (
  mediaType: MediaType,
  kind: CollectionKind
): { status: RequestStatus; items: Title[] } => {
  const { lang } = useI18n();
  const { status, data } = useCachedRequest(cache, `${lang}/${mediaType}/${kind}`, (signal) =>
    getCollection(mediaType, kind, { signal })
  );
  return { status, items: data ?? [] };
};
