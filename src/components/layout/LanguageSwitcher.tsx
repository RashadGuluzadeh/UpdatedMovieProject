import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { RiGlobalLine, RiArrowDownSLine, RiCheckLine } from "react-icons/ri";
import { LANGUAGES, languageInfo, useI18n, type LanguageCode } from "../../i18n/context";
import { useDismiss } from "../../hooks/useDismiss";

// Shows the short code ("EN") in the header; the open list pairs each code
// with the language's own name so the choice is still clear.
const LanguageSwitcher = () => {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = languageInfo(lang);

  useDismiss(wrapperRef, open, () => setOpen(false), buttonRef);

  // Open on the current language so arrow keys start from it.
  useEffect(() => {
    if (open) wrapperRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
  }, [open]);

  const choose = (code: LanguageCode) => {
    setLang(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const options = [...(wrapperRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const active = document.activeElement as HTMLElement | null;
    const i = active ? options.indexOf(active) : -1;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      options[(i + step + options.length) % options.length]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      options[e.key === "Home" ? 0 : options.length - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const picked = LANGUAGES[i];
      if (picked) choose(picked.code);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t("language.current", { name: current.label })}
        className="flex h-11 items-center gap-1.5 rounded-full bg-raised px-3 text-sm font-semibold tracking-wide text-fg transition-colors hover:bg-line"
      >
        <RiGlobalLine className="text-base text-muted" aria-hidden="true" />
        {current.code.toUpperCase()}
        <RiArrowDownSLine
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("language.label")}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-soft motion-safe:animate-fade-in"
        >
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <li
                key={l.code}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                lang={l.code}
                onClick={() => choose(l.code)}
                className="flex min-h-10 cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-raised focus:bg-raised focus:outline-none"
              >
                <span className="w-7 font-semibold text-fg">{l.code.toUpperCase()}</span>
                <span className="flex-1 text-muted">{l.label}</span>
                {selected && <RiCheckLine className="text-accent" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
