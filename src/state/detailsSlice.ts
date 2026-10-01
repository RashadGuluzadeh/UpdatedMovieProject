import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectedTitle, Title } from "../types";

type Openable = Pick<Title, "id" | "title"> & Partial<Title>;

// The title shown in the details modal. Only the basics already on screen
// (from a card, the hero or a suggestion) are kept here, so the modal can
// render instantly; it fetches the full details itself.
const toSelected = (item: Openable): SelectedTitle => ({
  id: item.id,
  mediaType: item.mediaType ?? "movie",
  title: item.title,
  poster_path: item.poster_path ?? null,
  backdrop_path: item.backdrop_path ?? null,
  release_date: item.release_date ?? "",
  overview: item.overview ?? "",
  vote_average: item.vote_average ?? null,
});

const detailsSlice = createSlice({
  name: "details",
  initialState: { selected: null as SelectedTitle | null },
  reducers: {
    openTitle(state, { payload }: PayloadAction<Openable>) {
      state.selected = toSelected(payload);
    },
    closeTitle(state) {
      state.selected = null;
    },
  },
});

export const { openTitle, closeTitle } = detailsSlice.actions;
export default detailsSlice.reducer;
