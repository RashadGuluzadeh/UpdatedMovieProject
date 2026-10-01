import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { setApiLanguage } from "../api/tmdb";
import {
  I18nContext,
  type I18nValue,
  type LanguageCode,
  detectLanguage,
  languageInfo,
  saveLanguage,
  translate,
} from "./context";

const initialLanguage = detectLanguage();
// Set before the first render so the very first TMDB requests use it.
setApiLanguage(languageInfo(initialLanguage).tmdb);

const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState(initialLanguage);

  const setLang = useCallback((code: LanguageCode) => {
    const info = languageInfo(code);
    setApiLanguage(info.tmdb);
    saveLanguage(info.code);
    setLangState(info.code);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      locale: languageInfo(lang).locale,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
