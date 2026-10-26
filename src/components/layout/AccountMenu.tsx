import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Account } from "../../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { Link, useLocation } from "react-router-dom";
import { RiLoginBoxLine, RiLogoutBoxRLine, RiBookmarkLine } from "react-icons/ri";
import { signOut, startSignIn } from "../../state/authSlice";
import { useI18n } from "../../i18n/context";
import { useDismiss } from "../../hooks/useDismiss";

const Avatar = ({ account, size = "h-11 w-11" }: { account: Account; size?: string }) => {
  const [broken, setBroken] = useState(false);
  const initial = (account.name || account.username || "?").charAt(0).toUpperCase();
  return account.avatarUrl && !broken ? (
    <img
      src={account.avatarUrl}
      alt=""
      onError={() => setBroken(true)}
      className={`img-outline ${size} rounded-full object-cover`}
    />
  ) : (
    <span
      className={`${size} flex items-center justify-center rounded-full bg-accent-strong font-semibold text-ink`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
};

const AccountMenu = () => {
  const { status, account, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const buttonRef = useRef<HTMLButtonElement>(null);
  useDismiss(wrapperRef, open, () => setOpen(false), buttonRef);

  // Move focus into the menu so keyboard users land on the first item.
  useEffect(() => {
    if (open) wrapperRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  if (status === "restoring" || status === "checking" || status === "completing") {
    return <span className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-raised" aria-hidden="true" />;
  }

  if (status !== "signedIn" || !account) {
    const redirecting = status === "redirecting";
    return (
      <button
        type="button"
        onClick={() => dispatch(startSignIn(pathname))}
        disabled={redirecting}
        title={error === "failed" ? t("auth.failed") : undefined}
        className="btn-primary h-11 shrink-0 rounded-full px-4"
      >
        <RiLoginBoxLine aria-hidden="true" />
        <span className="hidden sm:inline">{redirecting ? t("auth.redirecting") : t("auth.signIn")}</span>
        <span className="sr-only sm:hidden">{t("auth.signIn")}</span>
      </button>
    );
  }

  const moveFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(wrapperRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("auth.accountMenu", { name: account.name })}
        className="block rounded-full ring-offset-2 ring-offset-ink transition hover:ring-2 hover:ring-line"
      >
        <Avatar account={account} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={moveFocus}
          className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-soft motion-safe:animate-fade-in"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Avatar account={account} size="h-10 w-10" />
            <div className="min-w-0">
              <p className="text-xs text-subtle">{t("auth.signedInAs")}</p>
              <p className="truncate text-sm font-medium text-fg">{account.name}</p>
              {account.username && <p className="truncate text-xs text-muted">@{account.username}</p>}
            </div>
          </div>
          <Link
            to="/watchlist"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg transition-colors hover:bg-raised focus:bg-raised focus:outline-none"
          >
            <RiBookmarkLine className="text-muted" aria-hidden="true" />
            {t("nav.watchlist")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              dispatch(signOut());
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg transition-colors hover:bg-raised focus:bg-raised focus:outline-none"
          >
            <RiLogoutBoxRLine className="text-muted" aria-hidden="true" />
            {t("auth.signOut")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
