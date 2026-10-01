import axios from "axios";
import type {
  CastMember,
  Episode,
  MediaType,
  Season,
  SeriesSpotlight,
  Title,
  TitleDetails,
} from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.error(
    "VITE_TMDB_API_KEY is not set. Copy .env.example to .env.local and add your TMDB key."
  );
}

// Params are passed through axios so every value is URL-encoded,
// which stops user input from injecting extra query parameters.
export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: API_KEY },
  timeout: 10000,
});

// TMDB returns titles and overviews in this language when a translation
// exists (falling back to the original otherwise). Set by the I18nProvider.
let apiLanguage = "en-US";
export const setApiLanguage = (code: string): void => {
  apiLanguage = code;
};

tmdb.interceptors.request.use((config) => {
  config.params = { language: apiLanguage, ...config.params };
  return config;
});

interface RequestOptions {
  signal?: AbortSignal;
}

// ---------- Raw TMDB shapes (only the fields this app reads) ----------

interface RawTitle {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  original_language?: string;
  genre_ids?: number[];
}

interface RawPage {
  results?: RawTitle[];
}

interface RawEpisode {
  id: number;
  episode_number: number;
  name: string;
  air_date: string | null;
  vote_average: number;
  vote_count?: number;
}

interface RawSeason {
  season_number: number;
  name: string;
  episodes?: RawEpisode[];
}

interface RawVideo {
  site: string;
  key?: string;
  type: string;
  official?: boolean;
}

interface RawDetails extends RawTitle {
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  imdb_id?: string | null;
  genres?: { id: number; name: string }[];
  created_by?: { name: string }[];
  networks?: { name: string }[];
  seasons?: { season_number: number }[];
  credits?: {
    cast?: (CastMember & Record<string, unknown>)[];
    crew?: { job: string; name: string }[];
  };
  videos?: { results?: RawVideo[] };
  external_ids?: { imdb_id?: string | null };
}

// ---------- Helpers ----------

const IMG_BASE = "https://image.tmdb.org/t/p/";

export const posterUrl = (path: string | null | undefined, size = "w342"): string | null =>
  path ? `${IMG_BASE}${size}${path}` : null;

const assertMediaType = (mediaType: string): void => {
  if (mediaType !== "movie" && mediaType !== "tv") {
    throw new Error(`Unknown media type: ${mediaType}`);
  }
};

const assertId = (id: number): void => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid id: ${id}`);
  }
};

// TMDB uses title/release_date for movies but name/first_air_date for TV.
// Normalizing here lets every component treat both the same way.
export const normalizeTitle = (item: RawTitle, mediaType: MediaType): Title => ({
  id: item.id,
  mediaType,
  title: item.title ?? item.name ?? "Untitled",
  release_date: item.release_date ?? item.first_air_date ?? "",
  poster_path: item.poster_path ?? null,
  backdrop_path: item.backdrop_path ?? null,
  overview: item.overview ?? "",
  vote_average: item.vote_average ?? null,
  vote_count: item.vote_count ?? 0,
  popularity: item.popularity ?? 0,
  original_language: item.original_language,
  genre_ids: item.genre_ids ?? [],
});

const resultsOf = (data: RawPage | undefined, mediaType: MediaType): Title[] =>
  Array.isArray(data?.results) ? data.results.map((item) => normalizeTitle(item, mediaType)) : [];

// ---------- Lists ----------

export type CollectionKind = "trending" | "popular" | "top_rated";

const COLLECTION_PATHS: Record<CollectionKind, (mediaType: MediaType) => string> = {
  trending: (mediaType) => `/trending/${mediaType}/week`,
  popular: (mediaType) => `/${mediaType}/popular`,
  top_rated: (mediaType) => `/${mediaType}/top_rated`,
};

export const getCollection = async (
  mediaType: MediaType,
  kind: CollectionKind,
  { signal }: RequestOptions = {}
): Promise<Title[]> => {
  assertMediaType(mediaType);
  const { data } = await tmdb.get<RawPage>(COLLECTION_PATHS[kind](mediaType), { signal });
  return resultsOf(data, mediaType);
};

export const searchTitles = async (
  mediaType: MediaType,
  query: string,
  { signal }: RequestOptions = {}
): Promise<Title[]> => {
  assertMediaType(mediaType);
  const { data } = await tmdb.get<RawPage>(`/search/${mediaType}`, {
    params: { query, include_adult: false },
    signal,
  });
  return resultsOf(data, mediaType);
};

export const getMovie = async (id: number, { signal }: RequestOptions = {}): Promise<Title> => {
  assertId(id);
  const { data } = await tmdb.get<RawDetails>(`/movie/${id}`, { signal });
  return normalizeTitle(data, "movie");
};

// ---------- Series spotlight ----------

// TMDB allows at most 20 appended sub-requests per call.
const MAX_SEASONS = 20;
const NON_SCRIPTED_GENRES = new Set([10763, 10764, 10767]); // news, reality, talk
const SPOTLIGHT_MIN_VOTES = 300;
const SPOTLIGHT_EPISODES = { min: 6, max: 150 }; // long enough to chart, short enough to read
const SPOTLIGHT_CANDIDATES = 6;

// Every aired episode of a series with its rating, grouped by season.
// Season 0 (specials) is skipped; unaired episodes are dropped and episodes
// nobody has rated yet get `rating: null` so the chart shows a gap.
const getSeasonsWithEpisodes = async (show: RawDetails, { signal }: RequestOptions): Promise<Season[]> => {
  const numbers = (show.seasons ?? [])
    .map((s) => s.season_number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, MAX_SEASONS);
  if (numbers.length === 0) return [];

  const { data } = await tmdb.get<Record<string, RawSeason | undefined>>(`/tv/${show.id}`, {
    signal,
    params: { append_to_response: numbers.map((n) => `season/${n}`).join(",") },
  });
  const today = new Date().toISOString().slice(0, 10);

  return numbers
    .map((n) => data[`season/${n}`])
    .filter((season): season is RawSeason => Boolean(season))
    .map((season) => ({
      number: season.season_number,
      name: season.name,
      episodes: (season.episodes ?? [])
        .filter((e): e is RawEpisode & { air_date: string } => Boolean(e.air_date && e.air_date <= today))
        .map(
          (e): Episode => ({
            id: e.id,
            season: season.season_number,
            number: e.episode_number,
            name: e.name,
            airDate: e.air_date,
            rating: (e.vote_count ?? 0) > 0 ? e.vote_average : null,
            votes: e.vote_count ?? 0,
          })
        ),
    }))
    .filter((season) => season.episodes.length > 0);
};

// Picks a highly rated, currently trending scripted series whose episode count
// makes a readable chart, and loads its per-episode ratings.
export const getSeriesSpotlight = async (
  trending: Title[],
  { signal }: RequestOptions = {}
): Promise<SeriesSpotlight | null> => {
  const candidates = trending
    .filter(
      (s) =>
        (s.vote_count ?? 0) >= SPOTLIGHT_MIN_VOTES &&
        !(s.genre_ids ?? []).some((g) => NON_SCRIPTED_GENRES.has(g))
    )
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    .slice(0, SPOTLIGHT_CANDIDATES);

  for (const candidate of candidates) {
    const { data: show } = await tmdb.get<RawDetails>(`/tv/${candidate.id}`, { signal });
    const episodes = show.number_of_episodes ?? 0;
    if (episodes < SPOTLIGHT_EPISODES.min || episodes > SPOTLIGHT_EPISODES.max) continue;
    const seasons = await getSeasonsWithEpisodes(show, { signal });
    if (seasons.some((s) => s.episodes.some((e) => e.rating !== null))) {
      return {
        show: { ...normalizeTitle(show, "tv"), genres: (show.genres ?? []).map((g) => g.name) },
        seasons,
        source: "TMDB",
      };
    }
  }
  return null;
};

// ---------- Details ----------

const YOUTUBE_KEY_PATTERN = /^[\w-]{11}$/;
const IMDB_ID_PATTERN = /^tt\d{5,10}$/;
const CAST_LIMIT = 8;

const pickTrailer = (videos: RawVideo[] = []): string | null => {
  const youtube = videos.filter((v) => v.site === "YouTube" && YOUTUBE_KEY_PATTERN.test(v.key ?? ""));
  const rank = (v: RawVideo) =>
    (v.type === "Trailer" ? 0 : v.type === "Teaser" ? 1 : 2) - (v.official ? 0.5 : 0);
  return youtube.sort((a, b) => rank(a) - rank(b))[0]?.key ?? null;
};

// Full details for the details modal: one request with credits and videos
// appended, reduced to the fields the UI shows. External ids (YouTube, IMDb)
// are validated before they are ever put into a URL.
export const getTitleDetails = async (
  mediaType: MediaType,
  id: number,
  { signal }: RequestOptions = {}
): Promise<TitleDetails> => {
  assertMediaType(mediaType);
  assertId(id);
  const isTv = mediaType === "tv";
  const { data } = await tmdb.get<RawDetails>(`/${mediaType}/${id}`, {
    signal,
    params: {
      append_to_response: isTv ? "credits,videos,external_ids" : "credits,videos",
    },
  });
  const crew = data.credits?.crew ?? [];
  const imdbId = (isTv ? data.external_ids?.imdb_id : data.imdb_id) ?? "";

  return {
    ...normalizeTitle(data, mediaType),
    tagline: data.tagline,
    status: data.status,
    budget: data.budget,
    revenue: data.revenue,
    number_of_seasons: data.number_of_seasons,
    number_of_episodes: data.number_of_episodes,
    genres: (data.genres ?? []).map((g) => g.name),
    runtime: isTv ? (data.episode_run_time?.[0] ?? null) : (data.runtime ?? null),
    // Movies credit a director; series credit their creators.
    creators: isTv
      ? (data.created_by ?? []).map((c) => c.name)
      : crew.filter((c) => c.job === "Director").map((c) => c.name),
    networks: (data.networks ?? []).map((n) => n.name),
    cast: (data.credits?.cast ?? []).slice(0, CAST_LIMIT).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })),
    trailerKey: pickTrailer(data.videos?.results),
    imdbId: IMDB_ID_PATTERN.test(imdbId) ? imdbId : null,
  };
};
