import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { RiBookmarkLine, RiCheckboxCircleLine, RiLoginBoxLine } from "react-icons/ri";
import TitleCard from "../components/title/TitleCard";
import Reveal from "../components/ui/Reveal";
import ShareList from "../components/watchlist/ShareList";
import { useWatchlist } from "../hooks/useWatchlist";
import { startSignIn } from "../state/authSlice";
import { useI18n } from "../i18n/context";
import { useHideSplash } from "../utils/splash";

const SyncStatus = () => {
  const { status, account } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { t } = useI18n();

  if (status === "signedIn" && account) {
    return (
      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
        <RiCheckboxCircleLine className="text-rise" aria-hidden="true" />
        {t("auth.synced", { username: account.username })}
      </p>
    );
  }
  if (status !== "signedOut" && status !== "redirecting") return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4">
      <p className="flex-1 text-sm text-muted">{t("auth.hint")}</p>
      <button
        type="button"
        className="btn-primary"
        disabled={status === "redirecting"}
        onClick={() => dispatch(startSignIn(pathname))}
      >
        <RiLoginBoxLine aria-hidden="true" />
        {t(status === "redirecting" ? "auth.redirecting" : "auth.signIn")}
      </button>
    </div>
  );
};

const WatchlistPage = () => {
  useHideSplash();
  const { items, locked } = useWatchlist();
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t("watchlist.title")}</h1>
        <p className="mt-2 text-sm text-muted">
          {items.length > 0
            ? t("watchlist.count", { count: items.length })
            : t("watchlist.emptyHint")}
        </p>
        <SyncStatus />
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line py-20 text-center">
          <RiBookmarkLine className="text-4xl text-subtle" aria-hidden="true" />
          <p className="text-muted">{t("watchlist.empty")}</p>
          <Link to="/" className="btn-primary">
            {t("watchlist.browse")}
          </Link>
        </div>
      ) : (
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <ul className="stagger grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
            {items.map((movie, index) => (
              <TitleCard key={movie.id} index={index} item={movie} saved locked={locked} />
            ))}
          </ul>
          <aside className="w-full rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24 lg:w-80">
            <ShareList />
          </aside>
        </Reveal>
      )}
    </main>
  );
};

export default WatchlistPage;
