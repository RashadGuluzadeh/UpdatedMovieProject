// Shared domain types. TMDB responses are normalized into these shapes in
// src/api, so the rest of the app never deals with raw movie-vs-TV fields.

export type MediaType = "movie" | "tv";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

/** A movie or series as shown on cards, rows and the hero. */
export interface Title {
  id: number;
  mediaType: MediaType;
  /** `title` for movies, `name` for series. */
  title: string;
  /** `release_date` for movies, `first_air_date` for series ("" if unknown). */
  release_date: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number | null;
  vote_count?: number;
  popularity?: number;
  original_language?: string;
  genre_ids?: number[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

/** Everything the details modal shows. */
export interface TitleDetails extends Title {
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: string[];
  runtime: number | null;
  /** Directors for movies, creators for series. */
  creators: string[];
  networks: string[];
  cast: CastMember[];
  trailerKey: string | null;
  imdbId: string | null;
}

/** The basics of a title kept while the details modal loads the rest. */
export type SelectedTitle = Pick<
  Title,
  "id" | "mediaType" | "title" | "poster_path" | "release_date"
> & {
  backdrop_path: string | null;
  overview: string;
  vote_average: number | null;
};

/** A movie saved in the watchlist (stored in localStorage). */
export type WatchlistEntry = Pick<Title, "id" | "title" | "poster_path" | "release_date"> & {
  vote_average: number | null;
  mediaType: "movie";
};

export interface Episode {
  id: number;
  season: number;
  number: number;
  name: string;
  airDate: string;
  /** null when nobody has rated it yet. */
  rating: number | null;
  votes: number;
}

export interface EpisodeWithDelta extends Episode {
  /** Change from the previous rated episode, null for the first one. */
  delta: number | null;
}

export interface Season {
  number: number;
  name: string;
  episodes: Episode[];
}

export interface SeriesSpotlight {
  show: Title & { genres: string[] };
  seasons: Season[];
  source: string;
}

export interface Account {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface SharedList {
  title: string;
  movieIds: number[];
}
