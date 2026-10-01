import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import Layout from "./components/layout/Layout";
import PageLoader from "./components/layout/PageLoader";

import "react-loading-skeleton/dist/skeleton.css";

const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const ListPage = lazy(() => import("./pages/ListPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <SkeletonTheme baseColor="#1f232c" highlightColor="#2a2f3a">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            {/* key gives each section its own state when switching between them */}
            <Route path="/" element={<BrowsePage key="movie" mediaType="movie" />} />
            <Route path="/tv" element={<BrowsePage key="tv" mediaType="tv" />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/list/:id" element={<ListPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </SkeletonTheme>
  );
}

export default App;
