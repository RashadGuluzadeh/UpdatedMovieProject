import { useEffect, useRef, useState } from "react";
import type { RequestStatus } from "../types";

export interface Cache<T> {
  has(key: string): boolean;
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

// A Map that forgets its oldest entries past `limit`.
export const createCache = <T,>(limit = Infinity): Cache<T> => {
  const map = new Map<string, T>();
  return {
    has: (key) => map.has(key),
    get: (key) => map.get(key),
    set(key, value) {
      map.delete(key);
      map.set(key, value);
      if (map.size > limit) map.delete(map.keys().next().value as string);
    },
  };
};

export interface CachedRequest<T> {
  status: RequestStatus;
  data: T | undefined;
  /** Last successful data for any key, for showing stale results while loading. */
  previous: T | undefined;
}

interface Loaded<T> {
  key: string | null;
  status: RequestStatus;
  data: T | undefined;
}

// Loads `request(signal)` for `key` once and remembers the result in `cache`,
// so the same key (e.g. language + collection) is never fetched twice.
// - `key === null` means "not ready yet" and returns { status: "idle" }.
// - A changed key aborts the request in flight, so a slow old response can
//   never replace a newer one.
export const useCachedRequest = <T,>(
  cache: Cache<T>,
  key: string | null,
  request: (signal: AbortSignal) => Promise<T>
): CachedRequest<T> => {
  const [state, setState] = useState<Loaded<T>>({ key: null, status: "loading", data: undefined });
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  // The latest `request` is read through a ref so callers can pass an inline
  // function without retriggering the effect; `key` decides when to refetch.
  const requestRef = useRef(request);
  useEffect(() => {
    requestRef.current = request;
  });

  useEffect(() => {
    if (key === null || cache.has(key)) return;
    const controller = new AbortController();
    requestRef
      .current(controller.signal)
      .then((data) => {
        cache.set(key, data);
        setState({ key, status: "succeeded", data });
        setPrevious(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ key, status: "failed", data: undefined });
      });
    return () => controller.abort();
  }, [cache, key]);

  if (key === null) return { status: "idle", data: undefined, previous };
  if (cache.has(key)) return { status: "succeeded", data: cache.get(key), previous };
  if (state.key === key) return { status: state.status, data: state.data, previous };
  return { status: "loading", data: undefined, previous };
};
