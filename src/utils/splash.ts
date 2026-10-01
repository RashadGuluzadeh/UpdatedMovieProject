import { useEffect } from "react";

// The splash screen is plain HTML in index.html so it shows before any JS
// loads. Pages hide it once their main content is ready; a fallback timer
// in main.tsx makes sure it never stays up if something goes wrong.
const MIN_VISIBLE_MS = 700; // long enough to read as intentional, not a flash
const FADE_MS = 500;

export const hideSplash = (): void => {
  const el = document.getElementById("splash");
  if (!el || el.dataset.hiding) return;
  el.dataset.hiding = "true";
  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  setTimeout(() => {
    el.classList.add("splash--hide");
    setTimeout(() => el.remove(), FADE_MS + 100);
  }, wait);
};

export const useHideSplash = (ready = true): void => {
  useEffect(() => {
    if (ready) hideSplash();
  }, [ready]);
};
