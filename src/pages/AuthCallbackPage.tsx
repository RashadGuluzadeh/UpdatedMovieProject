import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { RiErrorWarningLine } from "react-icons/ri";
import { completeSignIn } from "../state/authSlice";
import { syncWatchlist } from "../state/watchlistSlice";
import PageLoader from "../components/layout/PageLoader";
import { useI18n } from "../i18n/context";
import { useHideSplash } from "../utils/splash";

// TMDB redirects here after the user approves (or denies) the sign-in:
// /auth/callback?request_token=…&approved=true  or  …&denied=true
const AuthCallbackPage = () => {
  useHideSplash();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      completeSignIn({
        requestToken: params.get("request_token"),
        approved: params.get("approved") === "true",
      })
    )
      .unwrap()
      .then(({ returnTo }) => {
        dispatch(syncWatchlist());
        navigate(returnTo, { replace: true });
      })
      // Failures are shown from the auth state below.
      .catch(() => {});
  }, [params, dispatch, navigate]);

  if (status === "signedOut" && error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <RiErrorWarningLine className="text-4xl text-danger" aria-hidden="true" />
        <p className="text-muted" role="alert">
          {t(error === "cancelled" ? "auth.cancelled" : "auth.failed")}
        </p>
        <Link to="/" className="btn-primary">
          {t("common.backToMovies")}
        </Link>
      </main>
    );
  }

  return <PageLoader label={t("auth.signingIn")} />;
};

export default AuthCallbackPage;
