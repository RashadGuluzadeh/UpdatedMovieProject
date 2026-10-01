import { tmdb, normalizeTitle, posterUrl } from "./tmdb";
import type { Account, Title } from "../types";

interface RawAvatar {
  tmdb?: { avatar_path?: string | null };
  gravatar?: { hash?: string | null };
}

// TMDB v3 user authentication:
//   1. create a request token,
//   2. send the user to themoviedb.org to approve it,
//   3. TMDB redirects back to /auth/callback?request_token=…&approved=true,
//   4. exchange the approved token for a session id.
// The session id lets this app read and change the user's TMDB watchlist.

const TOKEN_PATTERN = /^[a-f0-9]{40}$/i;
const GRAVATAR_HASH_PATTERN = /^[a-f0-9]{32}$/i;
const MAX_WATCHLIST_PAGES = 10;

export const isValidToken = (value: unknown): value is string =>
  typeof value === "string" && TOKEN_PATTERN.test(value);

const assertToken = (value: unknown, what: string): string => {
  if (!isValidToken(value)) throw new Error(`Invalid ${what}`);
  return value;
};

export const createRequestToken = async (): Promise<string> => {
  const { data } = await tmdb.get<{ request_token?: string }>("/authentication/token/new");
  return assertToken(data?.request_token, "request token");
};

export const authorizeUrl = (requestToken: string, redirectTo: string): string =>
  `https://www.themoviedb.org/authenticate/${encodeURIComponent(
    requestToken
  )}?redirect_to=${encodeURIComponent(redirectTo)}`;

export const createSession = async (requestToken: string): Promise<string> => {
  const { data } = await tmdb.post<{ session_id?: string }>("/authentication/session/new", {
    request_token: assertToken(requestToken, "request token"),
  });
  return assertToken(data?.session_id, "session id");
};

export const deleteSession = (sessionId: string | null) =>
  tmdb.delete("/authentication/session", { data: { session_id: sessionId } });

const avatarUrl = (avatar: RawAvatar | undefined): string | null => {
  if (avatar?.tmdb?.avatar_path) return posterUrl(avatar.tmdb.avatar_path, "w185");
  const hash = avatar?.gravatar?.hash;
  return GRAVATAR_HASH_PATTERN.test(hash ?? "")
    ? `https://secure.gravatar.com/avatar/${hash}?s=96&d=404`
    : null;
};

export const getAccount = async (sessionId: string | null): Promise<Account> => {
  const { data } = await tmdb.get<{ id?: number; username?: string; name?: string; avatar?: RawAvatar }>(
    "/account",
    { params: { session_id: sessionId } }
  );
  if (typeof data?.id !== "number" || !Number.isInteger(data.id)) throw new Error("Invalid account");
  return {
    id: data.id,
    username: String(data.username ?? ""),
    name: String(data.name || data.username || ""),
    avatarUrl: avatarUrl(data.avatar),
  };
};

export const getWatchlist = async (accountId: number, sessionId: string | null): Promise<Title[]> => {
  const movies: Title[] = [];
  for (let page = 1; page <= MAX_WATCHLIST_PAGES; page++) {
    const { data } = await tmdb.get<{ results?: Parameters<typeof normalizeTitle>[0][]; total_pages?: number }>(
      `/account/${accountId}/watchlist/movies`,
      {
        params: { session_id: sessionId, page, sort_by: "created_at.asc" },
      }
    );
    movies.push(...(data?.results ?? []).map((m) => normalizeTitle(m, "movie")));
    if (page >= (data?.total_pages ?? 1)) break;
  }
  return movies;
};

export const setWatchlist = (
  accountId: number,
  sessionId: string | null,
  movieId: number,
  onList: boolean
) =>
  tmdb.post(
    `/account/${accountId}/watchlist`,
    { media_type: "movie", media_id: movieId, watchlist: onList },
    { params: { session_id: sessionId } }
  );
