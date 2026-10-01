import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import detailsReducer from "./detailsSlice";
import watchlistReducer, { WATCHLIST_STORAGE_KEY } from "./watchlistSlice";
import authReducer from "./authSlice";
import { local } from "../utils/storage";

const store = configureStore({
  reducer: {
    search: searchReducer,
    details: detailsReducer,
    watchlist: watchlistReducer,
    auth: authReducer,
  },
  // Redux DevTools exposes the whole state, so keep it out of production.
  devTools: import.meta.env.DEV,
});

// Persist the watchlist whenever it changes (it also works without storage).
let lastItems = store.getState().watchlist.items;
store.subscribe(() => {
  const { items } = store.getState().watchlist;
  if (items === lastItems) return;
  lastItems = items;
  local.setJSON(WATCHLIST_STORAGE_KEY, items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
