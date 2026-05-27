import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, getLang, setLang, t as translate, LANGS } from '../lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  changeLang: (l: Lang) => void;
  t: (section: string, key: string) => string;
  langs: typeof LANGS;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  changeLang: () => {},
  t: (s, k) => k,
  langs: LANGS,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLang);

  function changeLang(l: Lang) {
    setLang(l);
    setLangState(l);
  }

  function t(section: string, key: string): string {
    return translate(lang, section as any, key);
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, langs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
