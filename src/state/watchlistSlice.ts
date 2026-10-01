import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "./hooks";
import type { RootState } from "./store";
import type { RequestStatus, Title, WatchlistEntry } from "../types";
import { createList } from "../api/lists";
import { getWatchlist, setWatchlist } from "../api/auth";
import { local } from "../utils/storage";

// Kept as "favorites" so watchlists saved before the rename still load.
export const WATCHLIST_STORAGE_KEY = "favorites";

// Only the fields the UI needs are stored, so localStorage stays small.
// The watchlist holds movies only: shared lists store TMDB movie ids.
type EntrySource = Pick<Title, "id" | "title" | "poster_path" | "release_date"> & {
  vote_average?: number | null;
};

const toEntry = ({ id, title, poster_path, release_date, vote_average }: EntrySource): WatchlistEntry => ({
  id,
  title,
  poster_path,
  release_date,
  vote_average: vote_average ?? null,
  mediaType: "movie",
});

const isEntrySource = (m: unknown): m is EntrySource =>
  typeof m === "object" &&
  m !== null &&
  Number.isInteger((m as EntrySource).id) &&
  typeof (m as EntrySource).title === "string";

// Saved data is untrusted (older versions, manual edits), so it is validated.
const loadSaved = (): WatchlistEntry[] => {
  const saved = local.getJSON<unknown>(WATCHLIST_STORAGE_KEY, []);
  return Array.isArray(saved) ? saved.filter(isEntrySource).map(toEntry) : [];
};

const isSignedIn = (state: RootState) => state.auth.status === "signedIn";

export interface WatchlistState {
  items: WatchlistEntry[];
  sharedListId: string | null;
  shareStatus: RequestStatus;
  syncError: boolean;
}

// ---------- Thunks ----------

export const shareWatchlist = createAppAsyncThunk("watchlist/share", (title: string, { getState }) =>
  createList(
    title,
    getState().watchlist.items.map((m) => m.id)
  )
);

// After signing in, the TMDB account becomes the source of truth. Movies added
// on this device before signing in are uploaded to it.
export const syncWatchlist = createAppAsyncThunk(
  "watchlist/sync",
  async (_: void, { getState, dispatch }) => {
    const { account, sessionId } = getState().auth;
    if (!account) return;
    const remote = await getWatchlist(account.id, sessionId);
    const remoteIds = new Set(remote.map((m) => m.id));
    const localOnly = getState().watchlist.items.filter((m) => !remoteIds.has(m.id));
    const uploads = await Promise.allSettled(
      localOnly.map((m) => setWatchlist(account.id, sessionId, m.id, true))
    );
    const uploaded = localOnly.filter((_, i) => uploads[i]?.status === "fulfilled");
    dispatch(watchlistSlice.actions.replace([...remote, ...uploaded]));
  },
  { condition: (_, { getState }) => isSignedIn(getState()) }
);

// Adds or removes a movie. The change shows immediately; when signed in it is
// also sent to TMDB and undone if that request fails.
export const toggleWatchlist = createAppAsyncThunk(
  "watchlist/toggle",
  async (item: Title | WatchlistEntry | (EntrySource & { mediaType: Title["mediaType"] }), { getState, dispatch }) => {
    const state = getState();
    const wasOnList = state.watchlist.items.some((m) => m.id === item.id);
    dispatch(watchlistSlice.actions.toggleLocal(item));
    if (!isSignedIn(state) || !state.auth.account) return;
    try {
      await setWatchlist(state.auth.account.id, state.auth.sessionId, item.id, !wasOnList);
    } catch (error) {
      dispatch(watchlistSlice.actions.toggleLocal(item));
      throw error;
    }
  },
  {
    condition: (item, { getState }) =>
      !getState().watchlist.sharedListId && item.mediaType === "movie",
  }
);

// ---------- Slice ----------

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: loadSaved(),
    // Once shared, the list is locked so the link matches what was saved.
    sharedListId: null,
    shareStatus: "idle" as RequestStatus,
    // Set when a change couldn't be saved to the TMDB account (and was undone).
    syncError: false,
  } as WatchlistState,
  reducers: {
    toggleLocal(state, { payload: movie }: PayloadAction<EntrySource>) {
      const index = state.items.findIndex((m) => m.id === movie.id);
      if (index === -1) state.items.push(toEntry(movie));
      else state.items.splice(index, 1);
    },
    replace(state, { payload: movies }: PayloadAction<EntrySource[]>) {
      state.items = movies.map(toEntry);
    },
    clearWatchlist(state) {
      state.items = [];
      state.sharedListId = null;
      state.shareStatus = "idle";
    },
    // Unlocks the list so another one can be shared. The items are kept:
    // when signed in they live in the TMDB account.
    startNewList(state) {
      state.sharedListId = null;
      state.shareStatus = "idle";
    },
    dismissSyncError(state) {
      state.syncError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(shareWatchlist.pending, (state) => {
        state.shareStatus = "loading";
      })
      .addCase(shareWatchlist.fulfilled, (state, { payload }) => {
        state.sharedListId = payload;
        state.shareStatus = "succeeded";
      })
      .addCase(shareWatchlist.rejected, (state) => {
        state.shareStatus = "failed";
      })
      .addCase(toggleWatchlist.rejected, (state, { meta }) => {
        if (!meta.condition) state.syncError = true;
      });
  },
});

export const { clearWatchlist, startNewList, dismissSyncError } = watchlistSlice.actions;
export default watchlistSlice.reducer;
