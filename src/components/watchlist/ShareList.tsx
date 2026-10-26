import { useId, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { RiLinkM, RiShareForwardLine } from "react-icons/ri";
import { shareWatchlist, startNewList } from "../../state/watchlistSlice";
import { TITLE_MAX_LENGTH } from "../../api/lists";
import { useI18n } from "../../i18n/context";

// Saves the watchlist as a shareable list, then shows the link to share.
const ShareList = () => {
  const { items, sharedListId, shareStatus } = useAppSelector((state) => state.watchlist);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const inputId = useId();
  const { t } = useI18n();

  const shareLink = sharedListId
    ? `${window.location.origin}/list/${encodeURIComponent(sharedListId)}`
    : null;

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (insecure context); the link is still visible.
    }
  };

  if (shareLink) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">{t("share.saved")}</p>
        <p className="truncate rounded-lg border border-line bg-raised px-3 py-2 text-xs text-subtle">
          {shareLink}
        </p>
        <div className="flex gap-2">
          <a href={shareLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
            <RiShareForwardLine aria-hidden="true" /> {t("share.open")}
          </a>
          <button type="button" onClick={copyLink} className="btn-ghost flex-1">
            <RiLinkM aria-hidden="true" /> {t(copied ? "share.copied" : "share.copy")}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch(startNewList());
            setTitle("");
          }}
          className="w-full text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          {t("share.newList")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(shareWatchlist(title));
      }}
      className="space-y-3"
    >
      <label htmlFor={inputId} className="block text-sm text-subtle">
        {t("share.label")}
      </label>
      <input
        id={inputId}
        className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent/60 focus:outline-none"
        value={title}
        placeholder={t("share.placeholder")}
        maxLength={TITLE_MAX_LENGTH}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!title.trim() || items.length === 0 || shareStatus === "loading"}
      >
        {t(shareStatus === "loading" ? "share.saving" : "share.save")}
      </button>
      {shareStatus === "failed" && (
        <p className="text-sm text-danger" role="alert">
          {t("share.failed")}
        </p>
      )}
    </form>
  );
};

export default ShareList;
