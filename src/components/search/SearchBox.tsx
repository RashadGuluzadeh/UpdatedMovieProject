import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useAppDispatch } from "../../state/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { openTitle } from "../../state/detailsSlice";
import { searchTitles } from "../../state/searchSlice";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { MIN_QUERY_CHARS, useSuggestions } from "../../hooks/useSuggestions";
import { useI18n } from "../../i18n/context";
import SuggestionList from "./SuggestionList";

const MAX_QUERY_LENGTH = 100;
const DEBOUNCE_MS = 250;

// Search field with a combobox of live suggestions. Picking a suggestion opens
// its details; Enter (or "See all results") runs a full search on the current
// section, Movies or TV Shows.
const SearchBox = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, lang } = useI18n();
  const mediaType = pathname.startsWith("/tv") ? "tv" : "movie";

  const [search, setSearch] = useState("");
  // The panel remembers which page it was opened on, so it closes by itself
  // when the user switches page (e.g. Movies -> TV Shows).
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (value: boolean) => setOpenedOn(value ? pathname : null);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const typed = search.trim();
  const debounced = useDebouncedValue(typed, DEBOUNCE_MS);
  const suggestions = useSuggestions(mediaType, debounced);
  const waiting = typed !== debounced && typed.length >= MIN_QUERY_CHARS;
  const status = waiting ? "loading" : suggestions.status;
  const { items } = suggestions;

  const showPanel = open && typed.length >= MIN_QUERY_CHARS;
  const optionCount = items.length + 1; // + "See all results"
  const activeIndex = Math.min(active, optionCount - 1);
  const optionId = (i: number) => `${listId}-option-${i}`;

  const runFullSearch = () => {
    if (!typed) return;
    setOpen(false);
    dispatch(searchTitles({ mediaType, query: typed, language: lang, reveal: true }));
    const browsePath = mediaType === "tv" ? "/tv" : "/";
    if (pathname !== browsePath) navigate(browsePath);
  };

  const pick = (index: number) => {
    setActive(-1);
    const chosen = items[index];
    if (chosen) {
      setOpen(false);
      dispatch(openTitle(chosen));
    } else {
      runFullSearch();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (typed.length < MIN_QUERY_CHARS) return;
      e.preventDefault();
      setOpen(true);
      // Positions cycle through -1 (the input itself) and every option.
      const step = e.key === "ArrowDown" ? 1 : -1;
      const positions = optionCount + 1;
      setActive((i) => ((Math.min(i, optionCount - 1) + 1 + step + positions) % positions) - 1);
    } else if (e.key === "Escape" && showPanel) {
      e.stopPropagation();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative min-w-0 flex-1 lg:w-80 lg:flex-none xl:w-96"
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <form
        className="flex items-center gap-2 rounded-full border border-line bg-raised py-1 pl-4 pr-1 transition-[border-color,box-shadow] focus-within:border-accent/70 focus-within:ring-2 focus-within:ring-accent/25"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          pick(showPanel ? activeIndex : -1);
        }}
      >
        <RiSearchLine className="shrink-0 text-subtle" aria-hidden="true" />
        <label htmlFor="movie-search" className="sr-only">
          {t(mediaType === "tv" ? "search.labelTv" : "search.labelMovie")}
        </label>
        <input
          id="movie-search"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-fg placeholder:text-subtle focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          type="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          placeholder={t(mediaType === "tv" ? "search.placeholderTv" : "search.placeholderMovie")}
          value={search}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-primary shrink-0 rounded-full px-4 py-1.5" type="submit">
          {t("search.button")}
        </button>
      </form>

      {showPanel && (
        <SuggestionList
          id={listId}
          optionId={optionId}
          items={items}
          status={status}
          stale={suggestions.stale || waiting}
          query={debounced}
          typed={typed}
          activeIndex={activeIndex}
          onHover={setActive}
          onPick={pick}
        />
      )}
    </div>
  );
};

export default SearchBox;
