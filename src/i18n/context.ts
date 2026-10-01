import { createContext, useContext } from "react";
import en from "./en";
import tr from "./tr";
import ru from "./ru";
import { local } from "../utils/storage";
import type { TranslationKey, Translation, TranslateVars } from "./types";

export type { TranslationKey, TranslateVars };
export type LanguageCode = "en" | "tr" | "ru";

export interface LanguageInfo {
  code: LanguageCode;
  /** The language's own name, e.g. "Türkçe". */
  label: string;
  /** Language sent to TMDB. */
  tmdb: string;
  /** Locale for dates, numbers and plural rules. */
  locale: string;
}

export const LANGUAGES: readonly LanguageInfo[] = [
  { code: "en", label: "English", tmdb: "en-US", locale: "en-US" },
  { code: "tr", label: "Türkçe", tmdb: "tr-TR", locale: "tr-TR" },
  { code: "ru", label: "Русский", tmdb: "ru-RU", locale: "ru-RU" },
];

const DICTIONARIES: Record<LanguageCode, Translation> = { en, tr, ru };
const STORAGE_KEY = "language";

const isLanguage = (code: unknown): code is LanguageCode =>
  typeof code === "string" && code in DICTIONARIES;

export const languageInfo = (code: string): LanguageInfo =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]!;

export const detectLanguage = (): LanguageCode => {
  const saved = local.get(STORAGE_KEY);
  if (isLanguage(saved)) return saved;
  const browser = navigator.language?.slice(0, 2);
  return isLanguage(browser) ? browser : "en";
};

export const saveLanguage = (code: LanguageCode): void => local.set(STORAGE_KEY, code);

type Node = Translation | Translation[keyof Translation] | string | undefined;

const lookup = (dict: Translation, key: string): Node =>
  key.split(".").reduce<Node>(
    (node, part) => (node && typeof node === "object" ? (node as Record<string, Node>)[part] : undefined),
    dict
  );

// Returns the translated string for `key`, falling back to English and then to
// the key itself. Object entries are plural forms chosen with Intl.PluralRules
// from `vars.count`; `{name}` placeholders are filled from `vars`.
export const translate = (lang: LanguageCode, key: TranslationKey, vars: TranslateVars = {}): string => {
  let entry = lookup(DICTIONARIES[lang], key) ?? lookup(en, key) ?? key;
  if (typeof entry === "object") {
    const forms = entry as Record<string, string | undefined>;
    const form = new Intl.PluralRules(languageInfo(lang).locale).select(Number(vars.count ?? 0));
    entry = forms[form] ?? forms.other ?? key;
  }
  return String(entry).replace(/\{(\w+)\}/g, (match, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : match
  );
};

export type TranslateFn = (key: TranslationKey, vars?: TranslateVars) => string;

export interface I18nValue {
  lang: LanguageCode;
  locale: string;
  setLang: (code: LanguageCode) => void;
  t: TranslateFn;
}

export const I18nContext = createContext<I18nValue>({
  lang: "en",
  locale: "en-US",
  setLang: () => {},
  t: (key, vars) => translate("en", key, vars),
});

export const useI18n = (): I18nValue => useContext(I18nContext);
