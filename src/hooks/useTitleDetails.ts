import { getTitleDetails } from "../api/tmdb";
import { useI18n } from "../i18n/context";
import { createCache, useCachedRequest } from "./useCachedRequest";
import type { MediaType, RequestStatus, TitleDetails } from "../types";

// Recently opened titles, so reopening one shows its details instantly.
const cache = createCache<TitleDetails>(30);

// Full details for the modal, refetched when the language changes so the
// overview and genres follow it.
export const useTitleDetails = (
  mediaType: MediaType,
  id: number
): { status: RequestStatus; details: TitleDetails | null } => {
  const { lang } = useI18n();
  const { status, data } = useCachedRequest(cache, `${lang}/${mediaType}/${id}`, (signal) =>
    getTitleDetails(mediaType, id, { signal })
  );
  return { status, details: data ?? null };
};
