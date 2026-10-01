import { Suspense, lazy } from "react";
import SlideShow from "../components/title/SlideShow";
import SearchResults from "../components/search/SearchResults";
import TitleRow from "../components/title/TitleRow";
import { useCollection } from "../hooks/useCollection";
import { useI18n } from "../i18n/context";
import { useHideSplash } from "../utils/splash";
import type { CollectionKind } from "../api/tmdb";
import type { MediaType } from "../types";

// Below the fold and the only user of the chart code, so loaded separately.
const SeriesSpotlight = lazy(() => import("../components/series/SeriesSpotlight"));

const HERO_COUNT = 5;
const ROW_KINDS: CollectionKind[] = ["trending", "popular", "top_rated"];

const CollectionRow = ({ mediaType, kind }: { mediaType: MediaType; kind: CollectionKind }) => {
  const { status, items } = useCollection(mediaType, kind);
  const { t } = useI18n();
  return (
    <TitleRow
      id={kind}
      title={t(`rows.${kind}.title`)}
      subtitle={t(`rows.${kind}.${mediaType}`)}
      status={status}
      items={items}
    />
  );
};

const BrowsePage = ({ mediaType }: { mediaType: MediaType }) => {
  const { t } = useI18n();
  // The hero shares the trending request with the first row (cached).
  const trending = useCollection(mediaType, "trending");
  // Keep the splash up until the hero has something to show.
  useHideSplash(trending.status !== "loading");

  return (
    <main>
      <h1 className="sr-only">{t(mediaType === "tv" ? "nav.tv" : "nav.movies")}</h1>
      <SlideShow
        label={t(mediaType === "tv" ? "browse.heroTv" : "browse.heroMovie")}
        status={trending.status}
        items={trending.items.slice(0, HERO_COUNT)}
      />
      <div className="space-y-14 pb-20">
        <SearchResults mediaType={mediaType} />
        {ROW_KINDS.map((kind) => (
          <CollectionRow key={kind} mediaType={mediaType} kind={kind} />
        ))}
        <Suspense fallback={null}>
          <SeriesSpotlight />
        </Suspense>
      </div>
    </main>
  );
};

export default BrowsePage;
