import axios from "axios";
import type { SharedList } from "../types";

const lists = axios.create({
  baseURL: "https://acb-api.algoritmika.org/api/movies",
  timeout: 10000,
});

const LIST_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
export const TITLE_MAX_LENGTH = 100;

export const isValidListId = (id: unknown): id is string =>
  typeof id === "string" && LIST_ID_PATTERN.test(id);

export const createList = async (title: string, movieIds: number[]): Promise<string> => {
  const cleanTitle = title.trim().slice(0, TITLE_MAX_LENGTH);
  if (!cleanTitle || movieIds.length === 0) {
    throw new Error("A list needs a title and at least one movie.");
  }
  const { data } = await lists.post<{ id?: string | number }>("/list", {
    title: cleanTitle,
    movies: movieIds,
  });
  const id = String(data?.id ?? "");
  if (!isValidListId(id)) {
    throw new Error("The server returned an invalid list id.");
  }
  return id;
};

// The list API is a third-party service, so its response is treated as
// untrusted: the title must be a string and only positive integer ids are kept.
export const getList = async (
  id: string,
  { signal }: { signal?: AbortSignal } = {}
): Promise<SharedList> => {
  if (!isValidListId(id)) {
    throw new Error("Invalid list id.");
  }
  const { data } = await lists.get<{ title?: unknown; movies?: unknown }>(`/list/${encodeURIComponent(id)}`, {
    signal,
  });
  const movieIds = Array.isArray(data?.movies)
    ? [...new Set(data.movies.map(Number))].filter(
        (n) => Number.isInteger(n) && n > 0
      )
    : [];
  return {
    title:
      typeof data?.title === "string"
        ? data.title.slice(0, TITLE_MAX_LENGTH)
        : "Untitled list",
    movieIds,
  };
};
