import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { RiAddLine, RiCloseLine, RiPlayFill, RiExternalLinkLine, RiStarFill } from "react-icons/ri";
import { posterUrl } from "../../api/tmdb";
import { closeTitle } from "../../state/detailsSlice";
import { toggleWatchlist } from "../../state/watchlistSlice";
import { formatDate, formatRating, formatRuntime, formatYear } from "../../utils/format";
import { useDialog } from "../../hooks/useDialog";
import { useTitleDetails } from "../../hooks/useTitleDetails";
import { CastList, DetailsSkeleton, TitleFacts } from "./TitleExtras";
import { useI18n } from "../../i18n/context";
import noImage from "../../assets/no-image.png";
import FadeImg from "../ui/FadeImg";
import type { SelectedTitle } from "../../types";

const TitleModalContent = ({ item, onClose }: { item: SelectedTitle; onClose: () => void }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { t, locale } = useI18n();
  const { status, details } = useTitleDetails(item.mediaType, item.id);
  const [showTrailer, setShowTrailer] = useState(false);
  const onWatchlist = useAppSelector((state) =>
    state.watchlist.items.some((m) => m.id === item.id)
  );
  const listLocked = useAppSelector((state) => Boolean(state.watchlist.sharedListId));

  useDialog(dialogRef, onClose);

  // Show what we already know right away, then fill in the full details.
  const m = details ?? item;
  const year = formatYear(m.release_date);
  const runtime = formatRuntime(details?.runtime, t);
  const titleId = `title-modal-${item.mediaType}-${item.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm motion-safe:animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl bg-surface border border-line shadow-soft motion-safe:animate-pop-in"
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label={t("modal.close")}
          className="icon-btn absolute right-3 top-3 z-10 h-10 w-10 bg-ink/70 text-fg backdrop-blur hover:bg-raised"
        >
          <RiCloseLine className="text-2xl" aria-hidden="true" />
        </button>

        {/* Backdrop / trailer */}
        <div className="relative aspect-video max-h-[420px] w-full overflow-hidden rounded-t-2xl bg-raised">
          {showTrailer && details?.trailerKey ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${details.trailerKey}?autoplay=1&rel=0`}
              title={t("modal.trailerTitle", { title: m.title })}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <>
              {m.backdrop_path && (
                <FadeImg
                  src={posterUrl(m.backdrop_path, "w1280") ?? undefined}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            </>
          )}
        </div>

        <div className="relative px-5 pb-8 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-24">
            <img
              src={posterUrl(m.poster_path) ?? noImage}
              alt={t("title.poster", { title: m.title })}
              className="img-outline relative w-28 sm:w-40 aspect-[2/3] shrink-0 rounded-xl object-cover"
            />
            <div className="flex flex-col justify-end gap-3 min-w-0 sm:pt-28">
              <h2 id={titleId} className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                {m.title}
                {year && <span className="ml-2 font-normal text-muted">({year})</span>}
              </h2>
              {details?.tagline && (
                <p className="text-sm italic text-muted">{details.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm tabular-nums text-muted">
                <span className="flex items-center gap-1.5 text-fg">
                  <RiStarFill className="text-star" aria-hidden="true" />
                  {formatRating(m.vote_average)}
                  <span className="text-subtle">{t("title.outOf")}</span>
                </span>
                {runtime && <span>{runtime}</span>}
                {m.release_date && <span>{formatDate(m.release_date, locale)}</span>}
                {details?.original_language && (
                  <span className="uppercase">{details.original_language}</span>
                )}
              </div>
              {details && details.genres.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label={t("modal.genres")}>
                  {details.genres.map((g) => (
                    <li key={g} className="chip">{g}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {item.mediaType === "movie" && (
              <button
                type="button"
                className={onWatchlist ? "btn-ghost hover:text-danger" : "btn-primary"}
                disabled={listLocked}
                title={listLocked ? t("card.locked") : undefined}
                aria-pressed={onWatchlist}
                onClick={() => dispatch(toggleWatchlist({ ...m, mediaType: item.mediaType }))}
              >
                {onWatchlist ? (
                  <><RiCloseLine aria-hidden="true" /> {t("modal.removeWatchlist")}</>
                ) : (
                  <><RiAddLine aria-hidden="true" /> {t("modal.addWatchlist")}</>
                )}
              </button>
            )}
            {details?.trailerKey && !showTrailer && (
              <button type="button" className="btn-ghost" onClick={() => setShowTrailer(true)}>
                <RiPlayFill aria-hidden="true" /> {t("modal.trailer")}
              </button>
            )}
            {details?.imdbId && (
              <a
                className="btn-ghost"
                href={`https://www.imdb.com/title/${details.imdbId}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                IMDb <RiExternalLinkLine aria-hidden="true" />
              </a>
            )}
          </div>

          <section className="mt-8">
            <h3 className="text-sm font-medium text-muted">{t("modal.overview")}</h3>
            <p className="mt-2 leading-relaxed text-muted">
              {m.overview || t("title.noOverview")}
            </p>
          </section>

          <div className="mt-8">
            {status === "loading" && <DetailsSkeleton />}
            {status === "failed" && (
              <p className="text-sm text-danger" role="alert">
                {t("modal.error")}
              </p>
            )}
            {status === "succeeded" && details && (
              <>
                <TitleFacts details={details} />
                {details.cast.length > 0 && (
                  <section className="mt-8">
                    <h3 className="mb-4 text-sm font-medium text-muted">{t("modal.topCast")}</h3>
                    <CastList cast={details.cast} />
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TitleModal = () => {
  const item = useAppSelector((state) => state.details.selected);
  const dispatch = useAppDispatch();
  const onClose = useCallback(() => dispatch(closeTitle()), [dispatch]);

  if (!item) return null;
  // key resets trailer/details state when a different title is opened
  return createPortal(
    <TitleModalContent key={`${item.mediaType}-${item.id}`} item={item} onClose={onClose} />,
    document.body
  );
};

export default TitleModal;
