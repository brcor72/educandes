import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface Props {
  variant?: 'navbar' | 'card';
}

export default function LanguageSwitcher({ variant = 'navbar' }: Props) {
  const [open, setOpen] = useState(false);
  const { lang, changeLang, langs, t } = useLang();
  const current = langs.find(l => l.code === lang) ?? langs[0];

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <p className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-andean-500" />
          {t('auth', 'changeLang')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {langs.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${lang === l.code ? 'border-andean-500 bg-andean-50' : 'border-stone-200 hover:border-andean-300'}`}
            >
              <span className="text-lg">{l.flag}</span>
              <div>
                <p className="text-xs font-semibold text-stone-800">{l.greeting}</p>
                <p className="text-xs text-stone-500">{l.label}</p>
              </div>
              {lang === l.code && <Check className="w-3 h-3 text-andean-500 ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm bg-andean-800 hover:bg-andean-600 px-3 py-1.5 rounded-full text-white transition-colors"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:block">{current.label.split(' ')[0]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50 min-w-[200px]">
            <p className="text-xs font-semibold text-stone-400 px-4 pt-3 pb-1 uppercase tracking-wider">
              {t('auth', 'changeLang')}
            </p>
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => { changeLang(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${lang === l.code ? 'bg-andean-50' : 'hover:bg-stone-50'}`}
              >
                <span className="text-lg">{l.flag}</span>
                <div>
                  <p className={`text-sm font-medium ${lang === l.code ? 'text-andean-700' : 'text-stone-700'}`}>{l.label}</p>
                  <p className="text-xs text-stone-400">{l.greeting}</p>
                </div>
                {lang === l.code && <Check className="w-4 h-4 text-andean-500 ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
