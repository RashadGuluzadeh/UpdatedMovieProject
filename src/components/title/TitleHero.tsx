import { BsFillStarFill } from "react-icons/bs";
import { RiInformationLine } from "react-icons/ri";
import { posterUrl } from "../../api/tmdb";
import { formatDate, formatRating } from "../../utils/format";
import noImage from "../../assets/no-image.png";
import { useI18n } from "../../i18n/context";
import type { Title } from "../../types";

interface TitleHeroProps {
  item: Title;
  className?: string;
  eagerImage?: boolean;
  onDetails?: (item: Title) => void;
}

const TitleHero = ({ item, className = "", eagerImage = false, onDetails }: TitleHeroProps) => {
  const backdrop = posterUrl(item.backdrop_path, "w1280");
  const { t, locale } = useI18n();

  return (
    <article
      className={`relative isolate overflow-hidden rounded-2xl border border-line/60 bg-surface ${className}`}
    >
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          loading={eagerImage ? "eager" : "lazy"}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-surface via-surface/90 to-surface/40" />

      <div className="flex flex-col gap-6 p-5 sm:p-8 md:flex-row md:gap-10">
        <img
          className="aspect-[2/3] w-40 shrink-0 self-center rounded-xl border border-line object-cover shadow-soft sm:w-52 md:self-start"
          src={posterUrl(item.poster_path, "w500") ?? noImage}
          alt={t("title.poster", { title: item.title })}
          loading={eagerImage ? "eager" : "lazy"}
        />
        <div className="flex min-w-0 flex-col">
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-4xl">
            {item.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span
              className="flex items-center gap-1.5 text-fg"
              aria-label={t("title.rating", { value: formatRating(item.vote_average) })}
            >
              <BsFillStarFill className="text-star" aria-hidden="true" />
              {formatRating(item.vote_average)}
            </span>
            <span>{formatDate(item.release_date, locale)}</span>
            {item.vote_count != null && <span>{t("title.votes", { count: item.vote_count })}</span>}
            {item.original_language && (
              <span className="uppercase">{item.original_language}</span>
            )}
          </div>
          <p className="mt-5 line-clamp-5 max-w-2xl leading-relaxed text-muted">
            {item.overview || t("title.noOverview")}
          </p>
          {onDetails && (
            <button
              type="button"
              onClick={() => onDetails(item)}
              className="btn-ghost mt-6 self-start"
            >
              <RiInformationLine aria-hidden="true" /> {t("title.moreDetails")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default TitleHero;
