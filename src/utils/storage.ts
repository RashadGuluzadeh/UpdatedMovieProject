// Web storage can throw (private mode, blocked site data, full quota), and in
// some browsers even reading `window.localStorage` throws. These wrappers never
// throw, so callers can treat storage as a best-effort cache.
const attempt = <T,>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export interface SafeStorage {
  get(key: string): string | null;
  /** `null`/`undefined` removes the key. */
  set(key: string, value: string | null | undefined): void;
  getJSON<T>(key: string, fallback: T): T;
  setJSON(key: string, value: unknown): void;
}

const createStore = (getArea: () => Storage): SafeStorage => ({
  get: (key) => attempt(() => getArea().getItem(key), null),
  set: (key, value) =>
    attempt(() => {
      if (value === null || value === undefined) getArea().removeItem(key);
      else getArea().setItem(key, value);
    }, undefined),
  getJSON: <T,>(key: string, fallback: T): T =>
    attempt(() => {
      const raw = getArea().getItem(key);
      return raw === null ? fallback : ((JSON.parse(raw) as T | null) ?? fallback);
    }, fallback),
  setJSON: (key, value) => attempt(() => getArea().setItem(key, JSON.stringify(value)), undefined),
});

export const local = createStore(() => window.localStorage);
export const session = createStore(() => window.sessionStorage);
