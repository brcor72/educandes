import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, BookOpen, Headphones, MessageSquare, Trophy, Heart } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const STEPS = [
  {
    icon: Heart,
    color: 'bg-andean-100 text-andean-600',
    img: '🏔️',
    titleKey: 'step1Title',
    bodyKey: 'step1Body',
  },
  {
    icon: BookOpen,
    color: 'bg-forest-100 text-forest-600',
    img: '📚',
    titleKey: 'step2Title',
    bodyKey: 'step2Body',
  },
  {
    icon: Headphones,
    color: 'bg-earth-100 text-earth-600',
    img: '🔊',
    titleKey: 'step3Title',
    bodyKey: 'step3Body',
  },
  {
    icon: MessageSquare,
    color: 'bg-andean-100 text-andean-600',
    img: '💬',
    titleKey: 'step4Title',
    bodyKey: 'step4Body',
  },
  {
    icon: Trophy,
    color: 'bg-yellow-100 text-yellow-600',
    img: '🌟',
    titleKey: 'step5Title',
    bodyKey: 'step5Body',
  },
];

interface Props {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const { t } = useLang();
  const { user } = useAuth();

  async function finish() {
    if (user) {
      try { await api.post('/profile/tutorial-done', {}); } catch {}
    }
    onComplete();
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Tutorial card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Skip button */}
        <button
          onClick={finish}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors z-10 flex items-center gap-1 text-sm"
        >
          <X className="w-4 h-4" />
          {t('tutorial', 'skip')}
        </button>

        {/* Step indicator */}
        <div className="flex gap-1.5 justify-center pt-6 pb-2 px-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-andean-500' : i < step ? 'w-4 bg-andean-300' : 'w-4 bg-stone-200'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 ${current.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl`}>
            {current.img}
          </div>

          <h2 className="text-xl font-bold text-stone-800 mb-3 leading-snug">
            {t('tutorial', current.titleKey)}
          </h2>
          <p className="text-stone-500 leading-relaxed text-sm">
            {t('tutorial', current.bodyKey)}
          </p>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('tutorial', 'prev')}
          </button>

          <span className="text-xs text-stone-400">{step + 1} / {STEPS.length}</span>

          {isLast ? (
            <button
              onClick={finish}
              className="flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white font-bold px-5 py-2.5 rounded-full transition-colors text-sm"
            >
              {t('tutorial', 'finish')} 🚀
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-1 text-sm font-medium text-andean-600 hover:text-andean-700 transition-colors"
            >
              {t('tutorial', 'next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
