import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { RiCloseLine } from "react-icons/ri";
import { CardSkeleton } from "../ui/CardSkeleton";
import TitleCard from "../title/TitleCard";
import Reveal from "../ui/Reveal";
import { clearSearch, searchTitles } from "../../state/searchSlice";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useI18n } from "../../i18n/context";
import type { MediaType } from "../../types";

const SKELETON_CARDS = 10;
const SECTION_ID = "search-results";

const SearchResults = ({ mediaType }: { mediaType: MediaType }) => {
  const search = useAppSelector((state) => state.search);
  const { ids, locked } = useWatchlist();
  const dispatch = useAppDispatch();
  const { t, lang } = useI18n();

  const active = search.status !== "idle" && search.mediaType === mediaType;

  // A search the user started brings the results into view (also after the
  // search box switched pages to run it); language refetches don't.
  useEffect(() => {
    if (active && search.reveal && search.requestId) {
      document.getElementById(SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active, search.reveal, search.requestId]);

  // Switching language re-runs the current search so titles are translated.
  useEffect(() => {
    if (active && search.status !== "loading" && search.language !== lang) {
      dispatch(searchTitles({ mediaType, query: search.query, language: lang }));
    }
  }, [active, lang, search.status, search.language, search.query, mediaType, dispatch]);

  if (!active) return null;

  const { results, status, query } = search;
  let message = null;
  if (status === "failed") {
    message = t("results.error");
  } else if (status === "succeeded" && results.length === 0) {
    message = t("results.empty", { query });
  }

  return (
    <Reveal
      as="section"
      id={SECTION_ID}
      aria-label={t("results.aria")}
      aria-busy={status === "loading"}
      className="mx-auto max-w-7xl scroll-mt-28 px-4 md:px-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">
          {t("results.title")} <span className="font-normal text-muted">{t("results.for", { query })}</span>
          {status === "succeeded" && results.length > 0 && (
            <span className="ml-3 text-sm font-normal text-subtle">
              {t("results.found", { count: results.length })}
            </span>
          )}
        </h2>
        <button type="button" className="btn-ghost" onClick={() => dispatch(clearSearch())}>
          <RiCloseLine aria-hidden="true" /> {t("results.clear")}
        </button>
      </div>

      {message ? (
        <p className="py-12 text-center text-muted" role="status">
          {message}
        </p>
      ) : (
        <ul className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {status === "loading" ? (
            <CardSkeleton cards={SKELETON_CARDS} />
          ) : (
            results.map((item, index) => (
              <TitleCard
                key={item.id}
                index={index}
                item={item}
                saved={ids.has(item.id)}
                locked={locked}
              />
            ))
          )}
        </ul>
      )}
    </Reveal>
  );
};

export default SearchResults;
