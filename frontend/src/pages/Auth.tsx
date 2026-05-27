import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mountain, Eye, EyeOff, Loader2, IdCard } from 'lucide-react';
import { api, AuthResponse } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

function validatePassword(p: string): string[] {
  const errors: string[] = [];
  if (p.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(p)) errors.push('Al menos 1 letra mayúscula');
  if (!/[0-9]/.test(p)) errors.push('Al menos 1 número');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) errors.push('Al menos 1 carácter especial');
  return errors;
}

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, langs, changeLang } = useLang();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passErrors, setPassErrors] = useState<string[]>([]);

  const [form, setForm] = useState({ dni: '', password: '', name: '', community: '', phone: '' });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
    if (field === 'password') setPassErrors(validatePassword(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{8}$/.test(form.dni)) { setError('El DNI debe tener exactamente 8 dígitos numéricos'); return; }
    if (tab === 'register' && passErrors.length > 0 && form.password) { setError('La contraseña no cumple los requisitos'); return; }

    setLoading(true); setError('');
    try {
      let res: AuthResponse;
      if (tab === 'login') {
        res = await api.post<AuthResponse>('/auth/login', { dni: form.dni, password: form.password });
      } else {
        if (!form.name.trim()) { setError('El nombre es requerido'); setLoading(false); return; }
        res = await api.post<AuthResponse>('/auth/register', {
          dni: form.dni, password: form.password, name: form.name,
          language: lang, community: form.community, phone: form.phone,
        });
      }
      login(res.user, res.token);
      navigate('/cursos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally { setLoading(false); }
  }

  const currentLang = langs.find(l => l.code === lang) ?? langs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-andean-800 to-andean-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-andean-700 text-white p-6 text-center">
          <Mountain className="w-10 h-10 text-andean-200 mx-auto mb-2" />
          <h1 className="text-xl font-bold">EducAndes</h1>
          <p className="text-andean-200 text-sm">Sierra del Perú</p>
        </div>

        <div className="p-6">
          {/* Language switcher card */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">{t('auth', 'changeLang')}</p>
            <div className="grid grid-cols-4 gap-2">
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all text-center ${lang === l.code ? 'border-andean-500 bg-andean-50' : 'border-stone-200 hover:border-andean-300'}`}
                >
                  <span className="text-xl">{l.flag}</span>
                  <span className="text-xs text-stone-600 mt-1 leading-tight">{l.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-5">
            {(['login', 'register'] as const).map(tabOpt => (
              <button
                key={tabOpt}
                onClick={() => setTab(tabOpt)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === tabOpt ? 'bg-white shadow text-andean-700' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {t('auth', tabOpt)}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-earth-50 border border-earth-200 text-earth-700 rounded-xl px-4 py-3 text-sm mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register-only fields */}
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('auth', 'name')} *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: María Quispe" required
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 transition-all" />
              </div>
            )}

            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <span className="flex items-center gap-1.5"><IdCard className="w-4 h-4 inline" /> {t('auth', 'dni')} *</span>
              </label>
              <input
                type="text"
                value={form.dni}
                onChange={e => set('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder={t('auth', 'dniHint')}
                maxLength={8}
                required
                pattern="\d{8}"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 transition-all font-mono tracking-widest"
              />
              <p className="text-xs text-stone-400 mt-1">{form.dni.length}/8 dígitos</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('auth', 'password')} *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder={tab === 'register' ? t('auth', 'passHint') : '••••••••'}
                  required minLength={tab === 'register' ? 8 : 1}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-andean-300 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password requirements (register only) */}
              {tab === 'register' && form.password && (
                <div className="mt-2 space-y-1">
                  {[
                    { ok: form.password.length >= 8, label: 'Mínimo 8 caracteres' },
                    { ok: /[A-Z]/.test(form.password), label: '1 letra mayúscula' },
                    { ok: /[0-9]/.test(form.password), label: '1 número' },
                    { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password), label: '1 carácter especial' },
                  ].map(req => (
                    <p key={req.label} className={`text-xs flex items-center gap-1.5 ${req.ok ? 'text-forest-600' : 'text-stone-400'}`}>
                      <span>{req.ok ? '✅' : '○'}</span> {req.label}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Register extra fields */}
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('auth', 'community')}</label>
                  <input type="text" value={form.community} onChange={e => set('community', e.target.value)} placeholder="Ej: Puno, Cusco, Apurímac..."
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('auth', 'phone')}</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+51 999 999 999"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 transition-all" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-andean-600 hover:bg-andean-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === 'login' ? t('auth', 'enter') : t('auth', 'create')}
            </button>
          </form>

          {tab === 'login' && (
            <div className="mt-4 p-3 bg-andean-50 rounded-xl text-center text-xs text-stone-500 border border-andean-100">
              <p className="font-medium text-andean-700 mb-0.5">Usuario demo</p>
              <p>DNI: <code className="font-mono">12345678</code> · Clave: <code className="font-mono">Demo1234!</code></p>
            </div>
          )}

          <Link to="/" className="block text-center text-sm text-stone-400 hover:text-stone-600 mt-4 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
