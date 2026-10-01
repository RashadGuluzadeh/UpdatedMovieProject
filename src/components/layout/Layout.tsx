import { Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import Header from "./Header";
import SyncErrorToast from "./SyncErrorToast";

// Loaded on first use: most visits never open the details modal.
const TitleModal = lazy(() => import("../title/TitleModal"));
import PageLoader from "./PageLoader";
import Footer from "./Footer";
import { restoreSession } from "../../state/authSlice";
import { syncWatchlist } from "../../state/watchlistSlice";

// Shared shell for every page: header with navigation and account, the
// details modal, and restoring a saved TMDB session on load.
const Layout = () => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const hasSelection = useAppSelector((state) => Boolean(state.details.selected));
  const { pathname } = useLocation();

  useEffect(() => {
    if (authStatus !== "restoring") return;
    dispatch(restoreSession())
      .unwrap()
      .then(() => dispatch(syncWatchlist()))
      .catch(() => {});
  }, [authStatus, dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* key replays the page-enter animation on every navigation */}
      <div key={pathname} className="flex-1 motion-safe:animate-page-in">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      {hasSelection && (
        <Suspense fallback={null}>
          <TitleModal />
        </Suspense>
      )}
      <SyncErrorToast />
    </div>
  );
};

export default Layout;
