import Skeleton from "react-loading-skeleton";
import { posterUrl } from "../../api/tmdb";
import { formatMoney } from "../../utils/format";
import { useI18n } from "../../i18n/context";
import noImage from "../../assets/no-image.png";
import type { TranslateFn } from "../../i18n/context";
import type { CastMember, TitleDetails } from "../../types";

// Building blocks of the details modal.

const Fact = ({ label, value }: { label: string; value: string | number | null | undefined }) =>
  value ? (
    <div>
      <dt className="text-xs uppercase tracking-wider text-subtle">{label}</dt>
      <dd className="mt-1 text-sm text-fg">{value}</dd>
    </div>
  ) : null;

export const CastList = ({ cast }: { cast: CastMember[] }) => (
  <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {cast.map((person) => (
      <li key={person.id} className="flex items-center gap-3 min-w-0">
        <img
          src={posterUrl(person.profile_path, "w185") ?? noImage}
          alt=""
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-full object-cover bg-raised"
        />
        <div className="min-w-0">
          <p className="truncate text-sm text-fg">{person.name}</p>
          <p className="truncate text-xs text-subtle">{person.character}</p>
        </div>
      </li>
    ))}
  </ul>
);

// Movies and series have different key facts.
type Fact = [label: string, value: string | number | null | undefined];

const factsFor = (details: TitleDetails, t: TranslateFn, locale: string): Fact[] =>
  details.mediaType === "tv"
    ? [
        [t("modal.facts.createdBy"), details.creators.join(", ")],
        [t("modal.facts.seasons"), details.number_of_seasons],
        [t("modal.facts.episodes"), details.number_of_episodes],
        [t("modal.facts.network"), details.networks.slice(0, 2).join(", ")],
      ]
    : [
        [t("modal.facts.director"), details.creators.join(", ")],
        [t("modal.facts.status"), details.status],
        [t("modal.facts.budget"), formatMoney(details.budget, locale)],
        [t("modal.facts.revenue"), formatMoney(details.revenue, locale)],
      ];


export const DetailsSkeleton = () => (
  <div className="space-y-3" aria-hidden="true">
    <Skeleton width="40%" />
    <Skeleton count={3} />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton circle width={48} height={48} />
          <Skeleton containerClassName="flex-1" />
        </div>
      ))}
    </div>
  </div>
);

// Key facts for a title in a definition list; empty values are skipped.
export const TitleFacts = ({ details }: { details: TitleDetails }) => {
  const { t, locale } = useI18n();
  return (
    <dl className="grid grid-cols-2 gap-6 rounded-xl border border-line bg-ink/40 p-5 sm:grid-cols-4">
      {factsFor(details, t, locale).map(([label, value]) => (
        <Fact key={label} label={label} value={value} />
      ))}
    </dl>
  );
};
