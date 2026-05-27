import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const LANG_CODES: Record<string, string> = {
  es: 'es-PE',
  qu: 'es-PE', // Quechua fallback al español peruano
  ay: 'es-PE', // Aymara fallback
  sh: 'es-PE', // Shipibo fallback
};

interface Props {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function AudioButton({ text, size = 'sm', className = '' }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const { lang, t } = useLang();

  function toggle() {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta audio. Usa Chrome o Edge.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_CODES[lang] ?? 'es-PE';
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  const base = size === 'sm'
    ? 'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors'
    : 'flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-full transition-colors';

  return (
    <button
      onClick={toggle}
      title={speaking ? t('audio', 'stop') : t('audio', 'listen')}
      className={`${base} ${speaking
        ? 'bg-andean-600 text-white'
        : 'bg-andean-50 hover:bg-andean-100 text-andean-700 border border-andean-200'
      } ${className}`}
    >
      {speaking
        ? <VolumeX className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        : <Volume2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {speaking ? t('audio', 'stop') : t('audio', 'listen')}
    </button>
  );
}
