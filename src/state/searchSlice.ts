import { createSlice } from "@reduxjs/toolkit";
import * as tmdb from "../api/tmdb";
import { rankByRelevance } from "../utils/search";
import { createAppAsyncThunk } from "./hooks";
import type { MediaType, RequestStatus, Title } from "../types";

export interface SearchArgs {
  mediaType: MediaType;
  query: string;
  language: string;
  reveal?: boolean;
}

export interface SearchState {
  mediaType: MediaType;
  query: string;
  language: string | null;
  reveal: boolean;
  results: Title[];
  status: RequestStatus;
  requestId: string | null;
}

// `language` is stored with the results so they can be refetched when the
// user switches language (the request itself uses the API language).
// `reveal` marks searches the user started, which scroll the results into view.
export const searchTitles = createAppAsyncThunk(
  "search/run",
  async ({ mediaType, query }: SearchArgs, { signal }) =>
    rankByRelevance(await tmdb.searchTitles(mediaType, query, { signal }), query)
);

const idle: SearchState = {
  mediaType: "movie",
  query: "",
  language: null,
  reveal: false,
  results: [],
  status: "idle",
  requestId: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState: idle,
  reducers: {
    clearSearch: (state): SearchState => ({ ...idle, mediaType: state.mediaType }),
  },
  extraReducers: (builder) => {
    builder
      // Only the most recent search may update the results, so a slow
      // earlier response can't overwrite a newer one.
      .addCase(searchTitles.pending, (_, { meta }): SearchState => ({
        mediaType: meta.arg.mediaType,
        query: meta.arg.query,
        language: meta.arg.language,
        reveal: Boolean(meta.arg.reveal),
        results: [],
        status: "loading",
        requestId: meta.requestId,
      }))
      .addCase(searchTitles.fulfilled, (state, { payload, meta }) => {
        if (state.requestId !== meta.requestId) return;
        state.results = payload;
        state.status = "succeeded";
      })
      .addCase(searchTitles.rejected, (state, { meta }) => {
        if (state.requestId !== meta.requestId) return;
        state.status = "failed";
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
