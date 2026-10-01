import { useMemo, useState } from "react";
import { useAppDispatch } from "../../state/hooks";
import Skeleton from "react-loading-skeleton";
import { BsFillStarFill } from "react-icons/bs";
import { RiInformationLine } from "react-icons/ri";
import { posterUrl } from "../../api/tmdb";
import { openTitle } from "../../state/detailsSlice";
import { useSeriesSpotlight } from "../../hooks/useSeriesSpotlight";
import { formatRating, formatYear } from "../../utils/format";
import { average, episodeCode, withDeltas } from "../../utils/episodes";
import EpisodeRatingsChart from "./EpisodeRatingsChart";
import EpisodeList from "./EpisodeList";
import Reveal from "../ui/Reveal";
import FadeImg from "../ui/FadeImg";
import { useI18n } from "../../i18n/context";
import type { EpisodeWithDelta } from "../../types";

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rounded-xl border border-line/60 bg-surface p-4">
    <p className="text-xs uppercase tracking-wider text-subtle">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold text-fg">{value}</p>
    {hint && <p className="mt-0.5 truncate text-xs text-muted">{hint}</p>}
  </div>
);

const SpotlightSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    <Skeleton className="block aspect-[16/9] sm:aspect-[21/9]" borderRadius={16} />
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} height={84} borderRadius={12} />
      ))}
    </div>
    <Skeleton height={320} borderRadius={16} />
  </div>
);


const SeriesSpotlight = () => {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { status, data } = useSeriesSpotlight();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  const episodes = useMemo(
    () => (data ? withDeltas(data.seasons.flatMap((s) => s.episodes)) : []),
    [data]
  );

  if (status === "empty") return null;

  const heading = (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-wider text-accent">{t("spotlight.eyebrow")}</p>
      <h2 id="spotlight-heading" className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
        {t("spotlight.title")}
      </h2>
    </div>
  );

  if (status !== "succeeded" || !data) {
    return (
      <section aria-labelledby="spotlight-heading" className="mx-auto max-w-7xl px-4 md:px-8">
        {heading}
        {status === "failed" ? (
          <p className="py-8 text-sm text-muted" role="alert">{t("spotlight.error")}</p>
        ) : (
          <SpotlightSkeleton />
        )}
      </section>
    );
  }

  const { show, seasons, source } = data;
  const activeSeason = selectedSeason ?? seasons[seasons.length - 1]?.number ?? 1;
  // Only series with at least one rated episode are picked, but the extremes
  // are still computed defensively.
  const rated = episodes.filter((e): e is EpisodeWithDelta & { rating: number } => e.rating !== null);
  const best = rated.reduce<(typeof rated)[number] | undefined>((a, b) => (!a || b.rating > a.rating ? b : a), undefined);
  const worst = rated.reduce<(typeof rated)[number] | undefined>((a, b) => (!a || b.rating < a.rating ? b : a), undefined);
  const seasonEpisodes = episodes.filter((e) => e.season === activeSeason);
  const seasonAverage = (n: number) =>
    average(rated.filter((e) => e.season === n).map((e) => e.rating));
  const backdrop = posterUrl(show.backdrop_path, "original");
  const genres = show.genres.slice(0, 3);

  return (
    <Reveal as="section" aria-labelledby="spotlight-heading" className="mx-auto max-w-7xl px-4 md:px-8">
      {heading}

      {/* Cover */}
      <div className="relative isolate overflow-hidden rounded-2xl border border-line/60 bg-surface">
        {backdrop && (
          <FadeImg
            src={backdrop}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
        <div className="flex min-h-[360px] flex-col justify-end p-6 sm:min-h-[460px] sm:p-10">
          <div className="max-w-2xl">
            <h3 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{show.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5 text-fg">
                <BsFillStarFill className="text-star" aria-hidden="true" />
                {formatRating(show.vote_average)}
              </span>
              {formatYear(show.release_date) && <span>{formatYear(show.release_date)}</span>}
              <span>{t("spotlight.seasons", { count: seasons.length })}</span>
              <span>{t("spotlight.episodes", { count: episodes.length })}</span>
            </div>
            {genres.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("modal.genres")}>
                {genres.map((g) => (
                  <li key={g} className="chip bg-ink/60 backdrop-blur">{g}</li>
                ))}
              </ul>
            )}
            <p className="mt-4 line-clamp-3 leading-relaxed text-fg/80">{show.overview}</p>
            <button
              type="button"
              className="btn-primary mt-6"
              onClick={() => dispatch(openTitle(show))}
            >
              <RiInformationLine aria-hidden="true" /> {t("title.moreDetails")}
            </button>
          </div>
        </div>
      </div>

      {/* Key numbers */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label={t("spotlight.average")}
          value={formatRating(average(rated.map((e) => e.rating)))}
          hint={t("spotlight.rated", { count: rated.length })}
        />
        {best && (
          <Stat label={t("spotlight.best")} value={formatRating(best.rating)} hint={`${episodeCode(best)} · ${best.name}`} />
        )}
        {worst && (
          <Stat label={t("spotlight.lowest")} value={formatRating(worst.rating)} hint={`${episodeCode(worst)} · ${worst.name}`} />
        )}
        <Stat
          label={t("spotlight.seasonAverage", { n: activeSeason })}
          value={formatRating(seasonAverage(activeSeason))}
          hint={seasons.find((s) => s.number === activeSeason)?.name}
        />
      </div>

      {/* Chart + episode list */}
      <div className="mt-6 rounded-2xl border border-line/60 bg-surface p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-semibold">{t("spotlight.chartTitle")}</h3>
            <p className="mt-1 text-sm text-muted">{t("spotlight.chartHint")}</p>
          </div>
          <p className="text-xs text-subtle">{t("spotlight.source", { source })}</p>
        </div>

        <EpisodeRatingsChart
          seasons={seasons}
          activeSeason={activeSeason}
          onSelectSeason={setSelectedSeason}
          showName={show.title}
        />

        <div className="mt-6 border-t border-line/60 pt-5">
          <div className="scrollbar-none -mx-1 mb-3 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t("spotlight.chooseSeason")}>
            {seasons.map((s) => (
              <button
                key={s.number}
                type="button"
                aria-pressed={s.number === activeSeason}
                onClick={() => setSelectedSeason(s.number)}
                className={`btn shrink-0 rounded-full px-3 py-1.5 ${
                  s.number === activeSeason ? "bg-accent-strong text-white" : "bg-raised text-muted hover:text-fg"
                }`}
              >
                {t("spotlight.season", { n: s.number })}
                <span className="text-xs opacity-75">★ {formatRating(seasonAverage(s.number))}</span>
              </button>
            ))}
          </div>
          {/* key replays the entrance when switching seasons */}
          <EpisodeList
            key={activeSeason}
            episodes={seasonEpisodes}
            label={t("spotlight.season", { n: activeSeason })}
          />
        </div>
      </div>
    </Reveal>
  );
};

export default SeriesSpotlight;
