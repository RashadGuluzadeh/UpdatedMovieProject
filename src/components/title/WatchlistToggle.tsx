import { useAppDispatch } from "../../state/hooks";
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { toggleWatchlist } from "../../state/watchlistSlice";
import { useI18n } from "../../i18n/context";
import type { Title, WatchlistEntry } from "../../types";

// Round + / ✓ button on a poster. On a saved movie the check turns into an X
// on hover, signalling that clicking removes it.
interface WatchlistToggleProps {
  item: Title | WatchlistEntry;
  saved: boolean;
  locked: boolean;
  className?: string;
}

const WatchlistToggle = ({ item, saved, locked, className = "" }: WatchlistToggleProps) => {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const label = t(saved ? "card.remove" : "card.add", { title: item.title });

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => dispatch(toggleWatchlist(item))}
      aria-pressed={saved}
      aria-label={label}
      title={locked ? t("card.locked") : label}
      className={`group/fav icon-btn h-9 w-9 text-lg backdrop-blur ${
        saved
          ? "bg-accent-strong text-white hover:bg-danger"
          : "bg-ink/70 text-fg hover:bg-accent-strong"
      } ${className}`}
    >
      {saved ? (
        <>
          {/* Shows a check, which turns into an X on hover to signal removal */}
          <AiOutlineCheck className="group-hover/fav:hidden" aria-hidden="true" />
          <AiOutlineClose className="hidden group-hover/fav:block" aria-hidden="true" />
        </>
      ) : (
        <AiOutlinePlus aria-hidden="true" />
      )}
    </button>
  );
};

export default WatchlistToggle;
