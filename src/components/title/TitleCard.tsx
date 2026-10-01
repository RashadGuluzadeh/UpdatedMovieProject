import { useAppDispatch } from "../../state/hooks";
import { BsFillStarFill } from "react-icons/bs";
import { openTitle } from "../../state/detailsSlice";
import { useI18n } from "../../i18n/context";
import { posterUrl } from "../../api/tmdb";
import { formatRating, formatYear } from "../../utils/format";
import noImage from "../../assets/no-image.png";
import FadeImg from "../ui/FadeImg";
import WatchlistToggle from "./WatchlistToggle";
import type { CSSProperties } from "react";
import type { Title, WatchlistEntry } from "../../types";


// `index` staggers the entrance animation (see .stagger in index.css).
interface TitleCardProps {
  item: Title | WatchlistEntry;
  saved?: boolean;
  locked?: boolean;
  className?: string;
  index?: number;
}

const TitleCard = ({ item, saved = false, locked = false, className = "", index = 0 }: TitleCardProps) => {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { title, poster_path, release_date, vote_average } = item;

  return (
    <li className={`group relative flex ${className}`} style={{ "--i": Math.min(index, 8) } as CSSProperties}>
      <button
        type="button"
        onClick={() => dispatch(openTitle(item))}
        aria-label={t("card.details", { title })}
        className="flex w-full flex-col overflow-hidden rounded-xl border border-line/60 bg-surface text-left shadow-soft transition duration-300 ease-out hover:border-line motion-safe:hover:-translate-y-1"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-raised">
          <FadeImg
            className="h-full w-full object-cover transition duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
            src={posterUrl(poster_path) ?? noImage}
            alt=""
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-ink/75 px-2 py-0.5 text-xs text-fg backdrop-blur">
            <BsFillStarFill className="text-star" aria-hidden="true" />
            {formatRating(vote_average)}
          </span>
        </div>
        <div className="p-3">
          {/* Fixed two-line height so long titles don't make cards taller */}
          <h3 className="line-clamp-2 h-10 text-sm font-medium leading-5 text-fg" title={title}>
            {title}
          </h3>
          <p className="mt-1 text-xs text-subtle">{formatYear(release_date) || "—"}</p>
        </div>
      </button>
      {item.mediaType === "movie" && (
        <WatchlistToggle
          item={item}
          saved={saved}
          locked={locked}
          className="absolute right-2 top-2"
        />
      )}
    </li>
  );
};

export default TitleCard;
