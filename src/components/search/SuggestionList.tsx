import { Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import { RiArrowRightLine, RiArrowGoBackLine, RiStarFill } from "react-icons/ri";
import { posterUrl } from "../../api/tmdb";
import { splitMatch } from "../../utils/search";
import { formatRating, formatYear } from "../../utils/format";
import { useI18n } from "../../i18n/context";
import noImage from "../../assets/no-image.png";
import type { MouseEvent } from "react";
import type { RequestStatus, Title } from "../../types";

const Highlight = ({ text, query }: { text: string; query: string }) =>
  splitMatch(text, query).map((part, i) =>
    part.match ? (
      <mark key={i} className="bg-transparent text-accent">
        {part.text}
      </mark>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    )
  );

const LoadingRows = () =>
  Array.from({ length: 3 }, (_, i) => (
    <li key={i} className="flex items-center gap-3 px-3 py-2" aria-hidden="true">
      <Skeleton width={36} height={54} borderRadius={4} />
      <div className="flex-1">
        <Skeleton width="70%" />
        <Skeleton width="30%" />
      </div>
    </li>
  ));

// The listbox under the search field. The last option is always "See all
// results"; `onPick(index)` with index === items.length means that option.
interface SuggestionListProps {
  id: string;
  optionId: (index: number) => string;
  items: Title[];
  status: RequestStatus;
  stale: boolean;
  /** The (debounced) text the suggestions were found for, used for highlighting. */
  query: string;
  /** What is in the field right now, used for "See all results". */
  typed: string;
  activeIndex: number;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}

const SuggestionList = ({
  id,
  optionId,
  items,
  status,
  stale,
  query,
  typed,
  activeIndex,
  onHover,
  onPick,
}: SuggestionListProps) => {
  const { t } = useI18n();
  // Mouse down would blur the input and close the panel before the click lands.
  const keepFocus = (e: MouseEvent) => e.preventDefault();
  const optionClass = (i: number) =>
    `flex cursor-pointer items-center gap-3 transition ${activeIndex === i ? "bg-raised" : ""}`;

  return (
    <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-soft motion-safe:animate-fade-in sm:left-auto sm:w-[28rem]">
      <ul
        id={id}
        role="listbox"
        aria-label={t("search.suggestions")}
        aria-busy={status === "loading"}
        className="max-h-[60vh] overflow-y-auto py-1"
      >
        {status === "loading" && items.length === 0 && <LoadingRows />}
        {status === "failed" && <li className="px-4 py-3 text-sm text-danger">{t("search.failed")}</li>}
        {status === "succeeded" && items.length === 0 && (
          <li className="px-4 py-3 text-sm text-muted">{t("search.noMatches", { query })}</li>
        )}

        {items.map((item, i) => (
          <li
            key={item.id}
            id={optionId(i)}
            role="option"
            aria-selected={activeIndex === i}
            onMouseDown={keepFocus}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(i)}
            className={`${optionClass(i)} px-3 py-2 ${stale ? "opacity-50" : ""}`}
          >
            <img
              src={posterUrl(item.poster_path, "w92") ?? noImage}
              alt=""
              className="img-outline h-[54px] w-9 shrink-0 rounded bg-raised object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-fg">
                <Highlight text={item.title} query={query} />
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-xs tabular-nums text-subtle">
                {formatYear(item.release_date) || "—"}
                <span className="flex items-center gap-1">
                  <RiStarFill className="text-star" aria-hidden="true" />
                  {formatRating(item.vote_average)}
                </span>
              </p>
            </div>
            {activeIndex === i && <RiArrowGoBackLine className="shrink-0 text-subtle" aria-hidden="true" />}
          </li>
        ))}

        <li
          id={optionId(items.length)}
          role="option"
          aria-selected={activeIndex === items.length}
          onMouseDown={keepFocus}
          onMouseEnter={() => onHover(items.length)}
          onClick={() => onPick(items.length)}
          className={`${optionClass(items.length)} justify-between border-t border-line px-4 py-3 text-sm text-accent`}
        >
          <span className="truncate">{t("search.seeAll", { query: typed })}</span>
          <RiArrowRightLine className="shrink-0" aria-hidden="true" />
        </li>
      </ul>
    </div>
  );
};

export default SuggestionList;
