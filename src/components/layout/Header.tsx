import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../state/hooks";
import { RiFilmLine, RiTvLine, RiBookmarkLine } from "react-icons/ri";
import SearchBox from "../search/SearchBox";
import LanguageSwitcher from "./LanguageSwitcher";
import AccountMenu from "./AccountMenu";
import { useI18n, type TranslationKey } from "../../i18n/context";
import type { IconType } from "react-icons";

interface NavItem {
  to: string;
  key: TranslationKey;
  icon: IconType;
  end?: boolean;
  showCount?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", key: "nav.movies", icon: RiFilmLine, end: true },
  { to: "/tv", key: "nav.tv", icon: RiTvLine },
  { to: "/watchlist", key: "nav.watchlist", icon: RiBookmarkLine, showCount: true },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
    isActive ? "bg-raised text-fg" : "text-muted hover:text-fg"
  }`;

const Header = () => {
  const count = useAppSelector((state) => state.watchlist.items.length);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-8">
        {/* Mobile: logo + controls / search / nav. Desktop (lg): one row. */}
        <Link to="/" className="order-1 font-display text-3xl font-semibold tracking-tight text-fg">
          Movies<span className="text-accent">.</span>
        </Link>

        <nav
          aria-label={t("nav.main")}
          className="scrollbar-none order-last -mx-1 w-full overflow-x-auto lg:order-2 lg:mx-0 lg:w-auto"
        >
          <ul className="flex gap-1">
            {NAV_ITEMS.map(({ to, key, icon: Icon, end, showCount }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={navClass}>
                  <Icon aria-hidden="true" />
                  {t(key)}
                  {showCount && count > 0 && (
                    <span className="rounded-full bg-accent-strong/20 px-1.5 text-[11px] font-semibold leading-5 text-accent">
                      {count}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-3 flex w-full lg:ml-auto lg:w-auto">
          <SearchBox />
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-4 lg:ml-0 lg:gap-3">
          <LanguageSwitcher />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
