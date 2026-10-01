import { getList } from "../api/lists";
import { getMovie } from "../api/tmdb";
import { useI18n } from "../i18n/context";
import { createCache, useCachedRequest } from "./useCachedRequest";
import type { RequestStatus, Title } from "../types";

interface LoadedList {
  title: string;
  movies: Title[];
}

const cache = createCache<LoadedList>(10);

const loadList = async (id: string, signal: AbortSignal): Promise<LoadedList> => {
  const list = await getList(id, { signal });
  // One broken movie id shouldn't hide the rest of the list.
  const settled = await Promise.allSettled(list.movieIds.map((movieId) => getMovie(movieId, { signal })));
  const movies = settled.filter((r) => r.status === "fulfilled").map((r) => r.value);
  return { title: list.title, movies };
};

// A shared list and its movies, in the current language.
export const useSharedList = (id: string): { status: RequestStatus } & LoadedList => {
  const { lang } = useI18n();
  const { status, data } = useCachedRequest(cache, `${lang}/${id}`, (signal) => loadList(id, signal));
  return { status, title: data?.title ?? "", movies: data?.movies ?? [] };
};
