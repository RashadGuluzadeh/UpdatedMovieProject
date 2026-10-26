import { formatDate, formatRating } from "../../utils/format";
import { useI18n } from "../../i18n/context";
import Delta from "./Delta";
import type { EpisodeWithDelta } from "../../types";

// One season's episodes: air date, rating (with a 0–10 bar) and the change
// from the previous episode.
const EpisodeList = ({ episodes, label }: { episodes: EpisodeWithDelta[]; label: string }) => {
  const { locale } = useI18n();
  return (
  <ol aria-label={label} className="divide-y divide-line/60 motion-safe:animate-fade-in">
    {episodes.map((e) => (
      <li key={e.id} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-2.5 sm:grid-cols-[4rem_1fr_7rem_6rem_4rem]">
        <span className="text-xs font-medium tabular-nums text-subtle">E{String(e.number).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm text-fg">{e.name}</span>
          <span className="block text-xs tabular-nums text-subtle sm:hidden">{formatDate(e.airDate, locale)}</span>
        </span>
        <span className="hidden text-xs tabular-nums text-subtle sm:block">{formatDate(e.airDate, locale)}</span>
        {/* Rating with a small bar on a 0–10 scale */}
        <span className="flex items-center gap-2 justify-self-end sm:justify-self-stretch">
          <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-raised sm:block" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-chart"
              style={{ width: `${(e.rating ?? 0) * 10}%` }}
            />
          </span>
          <span className="w-8 text-right text-sm tabular-nums text-fg">
            {e.rating !== null ? formatRating(e.rating) : "—"}
          </span>
        </span>
        <span className="col-start-3 justify-self-end sm:col-start-auto">
          <Delta value={e.delta} />
        </span>
      </li>
    ))}
  </ol>
);
};

export default EpisodeList;
