import { useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import TitleCard from "./TitleCard";
import Reveal from "../ui/Reveal";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useI18n } from "../../i18n/context";
import type { RequestStatus, Title } from "../../types";

const CARD_WIDTH = "w-36 sm:w-44 shrink-0 snap-start";

const RowSkeleton = () =>
  Array.from({ length: 8 }, (_, i) => (
    <li key={i} className={`${CARD_WIDTH} overflow-hidden rounded-xl border border-line/60 bg-surface`} aria-hidden="true">
      <Skeleton className="block aspect-[2/3]" borderRadius={0} />
      <div className="p-3">
        <Skeleton count={2} />
      </div>
    </li>
  ));

// A titled, horizontally scrolling row of cards (Netflix-style shelf).
interface TitleRowProps {
  id: string;
  title: string;
  subtitle?: string;
  status: RequestStatus;
  items: Title[];
}

const TitleRow = ({ id, title, subtitle, status, items }: TitleRowProps) => {
  const scroller = useRef<HTMLUListElement>(null);
  const { t } = useI18n();
  const { ids, locked } = useWatchlist();
  const headingId = `row-${id}`;

  const scrollBy = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <Reveal as="section" aria-labelledby={headingId} className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id={headingId} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-subtle">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("rows.scrollLeft", { title })}
            className="icon-btn h-9 w-9 border border-line bg-raised text-xl text-muted hover:text-fg"
          >
            <RiArrowLeftSLine aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("rows.scrollRight", { title })}
            className="icon-btn h-9 w-9 border border-line bg-raised text-xl text-muted hover:text-fg"
          >
            <RiArrowRightSLine aria-hidden="true" />
          </button>
        </div>
      </div>

      {status === "failed" ? (
        <p className="py-8 text-sm text-muted" role="alert">
          {t("rows.error")}
        </p>
      ) : (
        <ul
          ref={scroller}
          className="stagger scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-2 md:-mx-8 md:scroll-px-8 md:px-8"
        >
          {status === "loading" ? (
            <RowSkeleton />
          ) : (
            items.map((item, index) => (
              <TitleCard
                key={item.id}
                index={index}
                item={item}
                saved={ids.has(item.id)}
                locked={locked}
                className={CARD_WIDTH}
              />
            ))
          )}
        </ul>
      )}
    </Reveal>
  );
};

export default TitleRow;
