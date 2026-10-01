import { useMemo } from "react";
import { useAppSelector } from "../state/hooks";
import type { WatchlistEntry } from "../types";

// Watchlist items, a Set of their ids for quick lookups, and whether the list
// is locked (already shared as a link).
export const useWatchlist = (): { items: WatchlistEntry[]; ids: Set<number>; locked: boolean } => {
  const items = useAppSelector((state) => state.watchlist.items);
  const locked = useAppSelector((state) => Boolean(state.watchlist.sharedListId));
  const ids = useMemo(() => new Set(items.map((m) => m.id)), [items]);
  return { items, ids, locked };
};
