import { useAppDispatch } from "../../state/hooks";
import { RiAddLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { toggleWatchlist } from "../../state/watchlistSlice";
import { useI18n } from "../../i18n/context";
import type { Title, WatchlistEntry } from "../../types";

// Round + / ✓ button on a poster. On a saved movie the check turns into an X
// on hover or keyboard focus, signalling that clicking removes it.
//
// The three icons share one grid cell and cross-fade (opacity, scale and a
// little blur) instead of swapping display, so the change reads as one
// movement. The caller positions the button (it needs `absolute`), which also
// anchors the invisible hit-area extension below.
interface WatchlistToggleProps {
  item: Title | WatchlistEntry;
  saved: boolean;
  locked: boolean;
  className?: string;
}

// Written out in full so Tailwind can see every class.
const ICON =
  "[grid-area:1/1] transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none";
const SHOWN = "opacity-100 scale-100 blur-0";
const HIDDEN = "opacity-0 scale-[0.25] blur-[4px]";
const SHOWN_ON_INTENT =
  "group-hover/fav:opacity-100 group-hover/fav:scale-100 group-hover/fav:blur-0 group-focus-visible/fav:opacity-100 group-focus-visible/fav:scale-100 group-focus-visible/fav:blur-0";
const HIDDEN_ON_INTENT =
  "group-hover/fav:opacity-0 group-hover/fav:scale-[0.25] group-hover/fav:blur-[4px] group-focus-visible/fav:opacity-0 group-focus-visible/fav:scale-[0.25] group-focus-visible/fav:blur-[4px]";

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
      // after: grows the 36px circle to a 44px touch target without changing its look
      className={`group/fav icon-btn h-9 w-9 text-lg backdrop-blur after:absolute after:-inset-1 ${
        saved
          ? "bg-accent-strong text-ink hover:bg-danger"
          : "bg-ink/70 text-fg hover:bg-accent-strong hover:text-ink"
      } ${className}`}
    >
      <span className="grid place-items-center" aria-hidden="true">
        <RiAddLine className={`${ICON} ${saved ? HIDDEN : SHOWN}`} />
        <RiCheckLine className={`${ICON} ${saved ? `${SHOWN} ${HIDDEN_ON_INTENT}` : HIDDEN}`} />
        <RiCloseLine className={`${ICON} ${HIDDEN} ${saved ? SHOWN_ON_INTENT : ""}`} />
      </span>
    </button>
  );
};

export default WatchlistToggle;
