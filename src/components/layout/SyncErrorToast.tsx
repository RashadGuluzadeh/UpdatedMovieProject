import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";
import { dismissSyncError } from "../../state/watchlistSlice";
import { useI18n } from "../../i18n/context";

// Shown when a watchlist change couldn't be saved to the TMDB account.
const TOAST_MS = 5000;

const SyncErrorToast = () => {
  const show = useAppSelector((state) => state.watchlist.syncError);
  const dispatch = useAppDispatch();
  const { t } = useI18n();

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => dispatch(dismissSyncError()), TOAST_MS);
    return () => clearTimeout(timer);
  }, [show, dispatch]);

  if (!show) return null;
  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-fg shadow-soft motion-safe:animate-pop-in"
    >
      <RiErrorWarningLine className="mt-0.5 shrink-0 text-lg text-danger" aria-hidden="true" />
      <p className="flex-1">{t("auth.syncFailed")}</p>
      <button
        type="button"
        onClick={() => dispatch(dismissSyncError())}
        aria-label={t("modal.close")}
        className="icon-btn h-6 w-6 text-muted hover:text-fg"
      >
        <RiCloseLine aria-hidden="true" />
      </button>
    </div>
  );
};

export default SyncErrorToast;
