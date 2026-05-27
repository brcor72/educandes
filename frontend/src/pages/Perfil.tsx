import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, Save, Lock, BookOpen, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface ProfileData {
  id: number; dni: string; name: string; language: string; community: string | null;
  phone: string | null; role: string; tutorialDone: boolean; createdAt: string;
  stats: { lessonsCompleted: number; posts: number };
}

export default function Perfil() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', community: '', phone: '' });
  const [passForm, setPassForm] = useState({ current: '', next: '' });
  const [passMsg, setPassMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    api.get<ProfileData>('/profile')
      .then(p => { setProfile(p); setForm({ name: p.name, community: p.community ?? '', phone: p.phone ?? '' }); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  async function saveProfile() {
    setSaving(true); setError('');
    try {
      const res = await api.put<{ user: any }>('/profile', { ...form, language: lang });
      setProfile(p => p ? { ...p, ...res.user } : p);
      if (user) login({ ...user, name: form.name, language: lang }, localStorage.getItem('ay_token')!);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally { setSaving(false); }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPassMsg('');
    try {
      await api.post('/profile/password', { currentPassword: passForm.current, newPassword: passForm.next });
      setPassMsg('✅ Contraseña cambiada correctamente');
      setPassForm({ current: '', next: '' });
    } catch (err) {
      setPassMsg(`⚠️ ${err instanceof Error ? err.message : 'Error'}`);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-andean-500" />
    </div>
  );
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-andean-700 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 bg-andean-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
            {profile.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-andean-200 text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {t('profile', 'member')} {formatDate(profile.createdAt)}
            </p>
            {profile.community && <p className="text-andean-200 text-sm">📍 {profile.community}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 text-center">
            <BookOpen className="w-7 h-7 text-forest-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-stone-800">{profile.stats.lessonsCompleted}</p>
            <p className="text-sm text-stone-500">{t('profile', 'lessonsCompleted')}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 text-center">
            <MessageSquare className="w-7 h-7 text-andean-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-stone-800">{profile.stats.posts}</p>
            <p className="text-sm text-stone-500">{t('profile', 'posts')}</p>
          </div>
        </div>

        {/* Profile edit */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-stone-800 flex items-center gap-2">
              <User className="w-5 h-5 text-andean-500" />
              {t('profile', 'title')}
            </h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-andean-600 hover:text-andean-700 font-medium transition-colors">
                <Edit2 className="w-4 h-4" /> {t('profile', 'edit')}
              </button>
            ) : (
              <button onClick={() => setEditing(false)} className="text-sm text-stone-400 hover:text-stone-600 transition-colors">Cancelar</button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">DNI</label>
                <p className="text-stone-800 font-mono bg-stone-50 px-3 py-2 rounded-lg text-sm">{profile.dni}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">Rol</label>
                <p className="text-stone-800 bg-stone-50 px-3 py-2 rounded-lg text-sm capitalize">{profile.role}</p>
              </div>
            </div>

            {editing ? (
              <>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">{t('profile', 'edit')} - Nombre</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">Comunidad / Distrito</label>
                  <input value={form.community} onChange={e => setForm(f => ({ ...f, community: e.target.value }))}
                    placeholder="Ej: Puno, Cusco..."
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">WhatsApp / Teléfono</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+51 999 999 999"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300" />
                </div>
                {error && <p className="text-earth-600 text-sm">⚠️ {error}</p>}
                <button onClick={saveProfile} disabled={saving}
                  className="flex items-center gap-2 bg-andean-600 hover:bg-andean-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t('profile', 'save')}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">Nombre</label>
                  <p className="text-stone-800 text-sm">{profile.name}</p>
                </div>
                {profile.community && (
                  <div>
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">Comunidad</label>
                    <p className="text-stone-800 text-sm">{profile.community}</p>
                  </div>
                )}
                {profile.phone && (
                  <div>
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">Teléfono</label>
                    <p className="text-stone-800 text-sm">{profile.phone}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Language switcher */}
        <LanguageSwitcher variant="card" />

        {/* Password change */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="font-bold text-stone-800 flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-andean-500" />
            {t('profile', 'changePass')}
          </h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">{t('profile', 'currentPass')}</label>
              <input type="password" value={passForm.current} onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))} required
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1">{t('profile', 'newPass')}</label>
              <input type="password" value={passForm.next} onChange={e => setPassForm(f => ({ ...f, next: e.target.value }))} required
                placeholder="Mín. 8 car., 1 may., 1 núm., 1 especial"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300" />
            </div>
            {passMsg && <p className={`text-sm ${passMsg.startsWith('✅') ? 'text-forest-600' : 'text-earth-600'}`}>{passMsg}</p>}
            <button type="submit" className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              <Lock className="w-4 h-4" /> {t('profile', 'changePass')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
