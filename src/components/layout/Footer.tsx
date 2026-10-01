import { Link } from "react-router-dom";
import { RiArrowUpLine, RiExternalLinkLine, RiFilmLine, RiTvLine, RiBookmarkLine } from "react-icons/ri";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LANGUAGES, useI18n, type TranslationKey } from "../../i18n/context";

const BROWSE_LINKS: { to: string; key: TranslationKey; icon: IconType }[] = [
  { to: "/", key: "nav.movies", icon: RiFilmLine },
  { to: "/tv", key: "nav.tv", icon: RiTvLine },
  { to: "/watchlist", key: "nav.watchlist", icon: RiBookmarkLine },
];

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-subtle">{children}</h2>
);

// Fills a translated sentence like "Data provided by {tmdb}." with a link.
const Attribution = () => {
  const { t } = useI18n();
  const [before, after] = t("footer.data").split("{tmdb}");
  return (
    <p>
      {before}
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        TMDB
      </a>
      {after} {t("footer.disclaimer")}
    </p>
  );
};

const Footer = () => {
  const { t, lang, setLang } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* Brand */}
        <div>
          <Link to="/" className="font-display text-3xl font-semibold tracking-tight text-fg">
            Movies<span className="text-accent">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("footer.tagline")}</p>
        </div>

        {/* Browse */}
        <nav aria-label={t("footer.browse")}>
          <Heading>{t("footer.browse")}</Heading>
          <ul className="space-y-3">
            {BROWSE_LINKS.map(({ to, key, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <Icon className="text-subtle transition-colors group-hover:text-accent" aria-hidden="true" />
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language */}
        <div>
          <Heading>{t("footer.language")}</Heading>
          <ul className="space-y-2">
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  lang={l.code}
                  aria-pressed={l.code === lang}
                  onClick={() => setLang(l.code)}
                  className={`inline-flex items-center gap-3 rounded-lg px-2 py-1 text-sm transition-colors ${
                    l.code === lang ? "bg-raised text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  <span className="w-6 text-left font-semibold">{l.code.toUpperCase()}</span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* About the data */}
        <div>
          <Heading>{t("footer.about")}</Heading>
          <p className="text-sm leading-relaxed text-muted">{t("footer.aboutText")}</p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            {t("footer.visitTmdb")} <RiExternalLinkLine aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="space-y-1">
            <p className="text-muted">{t("footer.copyright", { year })}</p>
            <Attribution />
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn-ghost shrink-0 self-start sm:self-auto"
          >
            <RiArrowUpLine aria-hidden="true" /> {t("footer.backToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
