import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { EpisodeWithDelta, Season } from "../../types";
import { formatRating } from "../../utils/format";
import { episodeCode, withDeltas } from "../../utils/episodes";
import { useI18n } from "../../i18n/context";
import { useElementWidth } from "../../hooks/useElementWidth";
import Delta from "./Delta";

const HEIGHT = 300;
const MARGIN = { top: 28, right: 16, bottom: 58, left: 36 };
const MIN_LABEL_GAP = 24; // px between episode-number labels before thinning them out
const MAX_MARKERS = 60; // above this, dots only appear on hover to avoid clutter
const COLORS = {
  line: "#9085e9",
  grid: "#2a2f3a",
  surface: "#171a21",
  band: "rgba(31, 35, 44, 0.6)",
  text: "#9ba3b4",
  fg: "#e4e6eb",
  subtle: "#6b7385",
};

type Point = [x: number, y: number];

interface Segment {
  points: Point[];
  end: number;
}

interface EpisodeRatingsChartProps {
  seasons: Season[];
  activeSeason: number;
  onSelectSeason: (season: number) => void;
  showName: string;
}

// One line through every episode in airing order; season changes are marked
// with separators instead of colors, so any number of seasons stays readable.
const EpisodeRatingsChart = ({ seasons, activeSeason, onSelectSeason, showName }: EpisodeRatingsChartProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(wrapRef);
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const episodes = useMemo(() => withDeltas(seasons.flatMap((s) => s.episodes)), [seasons]);
  const rated = episodes.filter((e): e is EpisodeWithDelta & { rating: number } => e.rating !== null);
  const ratings = rated.map((e) => e.rating);
  const best = rated.reduce<(typeof rated)[number] | undefined>(
    (a, b) => (!a || b.rating > a.rating ? b : a),
    undefined
  );

  let lo = Math.max(0, Math.floor(Math.min(...ratings) - 0.5));
  const hi = Math.min(10, Math.ceil(Math.max(...ratings) + 0.3));
  if (hi - lo < 2) lo = Math.max(0, hi - 2);
  const tickStep = hi - lo > 6 ? 2 : 1;
  const ticks: number[] = [];
  for (let tick = lo; tick <= hi; tick += tickStep) ticks.push(tick);

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const n = episodes.length;
  const x = (i: number) => MARGIN.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (r: number) => MARGIN.top + (1 - (r - lo) / (hi - lo)) * innerH;
  const baseline = MARGIN.top + innerH;

  // Split the line where an episode has no rating yet, so gaps stay visible.
  const segments: Segment[] = [];
  episodes.forEach((e, i) => {
    if (e.rating === null) return;
    const point: Point = [x(i), y(e.rating)];
    const last = segments[segments.length - 1];
    if (last && last.end === i - 1) {
      last.points.push(point);
      last.end = i;
    } else {
      segments.push({ points: [point], end: i });
    }
  });
  const linePath = (pts: Point[]) => pts.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join("");
  const areaPath = (pts: Point[]) =>
    `${linePath(pts)}L${pts[pts.length - 1]?.[0]},${baseline}L${pts[0]?.[0]},${baseline}Z`;

  // Season regions: start/end x half-way between neighbouring episodes.
  const step = n > 1 ? innerW / (n - 1) : innerW;
  const labelEvery = Math.max(1, Math.ceil(MIN_LABEL_GAP / (step || 1)));
  const regions = seasons.map((s, si) => {
    const first = seasons.slice(0, si).reduce((sum, prev) => sum + prev.episodes.length, 0);
    const last = first + s.episodes.length - 1;
    return {
      number: s.number,
      x0: Math.max(MARGIN.left, x(first) - step / 2),
      x1: Math.min(MARGIN.left + innerW, x(last) + step / 2),
    };
  });

  const indexAt = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const px = clientX - rect.left - MARGIN.left;
    const i = Math.round((px / (innerW || 1)) * (n - 1));
    return Math.min(n - 1, Math.max(0, i));
  };

  const hovered = hover !== null ? episodes[hover] : undefined;
  const hoverX = hover !== null ? x(hover) : 0;
  const tooltipLeft = hovered ? Math.min(Math.max(hoverX, 90), width - 90) : 0;
  const tooltipTop = hovered ? (hovered.rating !== null ? y(hovered.rating) : baseline) : 0;

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    setHover((h) => Math.min(n - 1, Math.max(0, (h ?? (dir > 0 ? -1 : n)) + dir)));
  };

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          tabIndex={0}
          aria-label={t("spotlight.chartAria", {
            name: showName,
            count: rated.length,
            min: formatRating(Math.min(...ratings)),
            max: formatRating(Math.max(...ratings)),
          })}
          className="block cursor-crosshair touch-pan-y rounded-lg"
          onPointerMove={(e) => setHover(indexAt(e.clientX))}
          onPointerLeave={() => setHover(null)}
          onBlur={() => setHover(null)}
          onKeyDown={onKeyDown}
          onClick={() => hovered && onSelectSeason(hovered.season)}
        >
          {/* Active season band */}
          {regions
            .filter((r) => r.number === activeSeason)
            .map((r) => (
              <rect key="band" x={r.x0} y={MARGIN.top} width={r.x1 - r.x0} height={innerH} fill={COLORS.band} />
            ))}

          {/* Gridlines + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={MARGIN.left} x2={MARGIN.left + innerW} y1={y(t)} y2={y(t)} stroke={COLORS.grid} strokeWidth="1" />
              <text x={MARGIN.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={COLORS.subtle}>
                {t}
              </text>
            </g>
          ))}

          {/* Season separators + labels */}
          {regions.map((r, i) => (
            <g key={r.number}>
              {i > 0 && (
                <line x1={r.x0} x2={r.x0} y1={MARGIN.top} y2={baseline} stroke={COLORS.grid} strokeWidth="1" />
              )}
              <text
                x={(r.x0 + r.x1) / 2}
                y={baseline + 44}
                textAnchor="middle"
                fontSize="12"
                fill={r.number === activeSeason ? COLORS.text : COLORS.subtle}
                fontWeight={r.number === activeSeason ? 600 : 500}
              >
                {r.x1 - r.x0 > 72
                  ? t("spotlight.season", { n: r.number })
                  : t("spotlight.seasonShort", { n: r.number })}
              </text>
            </g>
          ))}

          {/* Episode numbers under each point (thinned out when crowded) */}
          {episodes.map((e, i) => {
            const isHovered = hover === i;
            if (!isHovered && (e.number - 1) % labelEvery !== 0) return null;
            return (
              <text
                key={`n-${e.id}`}
                x={x(i)}
                y={baseline + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? COLORS.fg : COLORS.text}
                className="tabular-nums"
              >
                {e.number}
              </text>
            );
          })}

          {/* Area wash + line */}
          {segments.map((s, i) => (
            <g key={i}>
              {s.points.length > 1 && <path d={areaPath(s.points)} fill={COLORS.line} opacity="0.1" />}
              <path
                d={linePath(s.points)}
                fill="none"
                stroke={COLORS.line}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Markers (with a surface ring so they read over the line) */}
          {n <= MAX_MARKERS &&
            episodes.map((e, i) =>
              e.rating === null ? null : (
                <circle key={e.id} cx={x(i)} cy={y(e.rating)} r="4" fill={COLORS.line} stroke={COLORS.surface} strokeWidth="2" />
              )
            )}

          {/* Direct label on the best episode only */}
          {best && (
            <text
              x={x(episodes.findIndex((e) => e.id === best.id))}
              y={y(best.rating) - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={COLORS.text}
            >
              {formatRating(best.rating)}
            </text>
          )}

          {/* Hover crosshair */}
          {hovered && (
            <g pointerEvents="none">
              <line x1={hoverX} x2={hoverX} y1={MARGIN.top} y2={baseline} stroke={COLORS.text} strokeWidth="1" opacity="0.5" />
              {hovered.rating !== null && (
                <circle cx={hoverX} cy={y(hovered.rating)} r="6" fill={COLORS.line} stroke={COLORS.surface} strokeWidth="2" />
              )}
            </g>
          )}
        </svg>
      )}

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 w-44 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-ink/95 px-3 py-2 text-xs shadow-soft backdrop-blur"
          style={{ left: tooltipLeft, top: tooltipTop - 12 }}
          role="status"
        >
          <p className="font-medium text-subtle">{episodeCode(hovered)}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-fg">{hovered.name}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-fg">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-chart" aria-hidden="true" />
              {hovered.rating !== null ? formatRating(hovered.rating) : t("spotlight.notRated")}
            </span>
            <Delta value={hovered.delta} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeRatingsChart;
