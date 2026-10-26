import { useAppDispatch } from "../state/hooks";
import { Link, useParams } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import { isValidListId } from "../api/lists";
import { useSharedList } from "../hooks/useSharedList";
import TitleHero from "../components/title/TitleHero";
import { HeroSkeleton } from "../components/ui/HeroSkeleton";
import { openTitle } from "../state/detailsSlice";
import { useI18n } from "../i18n/context";
import { useHideSplash } from "../utils/splash";

const NotFound = () => {
  const { t } = useI18n();
  return (
    <p className="py-16 text-center text-muted" role="alert">
      {t("list.notFound")}
    </p>
  );
};

const SharedList = ({ id }: { id: string }) => {
  const state = useSharedList(id);
  const dispatch = useAppDispatch();
  const { t } = useI18n();

  if (state.status === "loading") return <HeroSkeleton className="" />;
  if (state.status === "failed") return <NotFound />;

  return (
    <>
      <header className="mb-8">
        <p className="text-sm text-subtle">{t("list.shared")}</p>
        <h1 className="mt-1 break-words font-display text-3xl font-semibold sm:text-4xl">
          {state.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{t("list.count", { count: state.movies.length })}</p>
      </header>
      {state.movies.length === 0 && (
        <p className="py-16 text-center text-muted">{t("list.empty")}</p>
      )}
      <div className="space-y-6">
        {state.movies.map((movie) => (
          <TitleHero
            key={movie.id}
            item={movie}
            onDetails={(m) => dispatch(openTitle(m))}
          />
        ))}
      </div>
    </>
  );
};

const ListPage = () => {
  useHideSplash();
  const { id } = useParams();
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
      >
        <RiArrowLeftLine aria-hidden="true" /> {t("common.backToMovies")}
      </Link>
      {isValidListId(id) ? <SharedList id={id} /> : <NotFound />}
    </main>
  );
};

export default ListPage;
