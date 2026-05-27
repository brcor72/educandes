import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Clock, ChevronRight, Loader2, X } from 'lucide-react';
import { api, ForumPost, Course } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function Foros() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ courseSlug: '', title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<ForumPost[]>('/forums'),
      api.get<Course[]>('/courses'),
    ])
      .then(([p, c]) => { setPosts(p); setCourses(c); })
      .catch(() => setError('Error al cargar el foro'))
      .finally(() => setLoading(false));
  }, []);

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setSubmitting(true);
    try {
      const post = await api.post<ForumPost>('/forums', form);
      setPosts((p) => [{ ...post, course: courses.find(c => c.slug === form.courseSlug) as any, _count: { replies: 0 } }, ...p]);
      setShowForm(false);
      setForm({ courseSlug: '', title: '', body: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-andean-700 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Foros de la comunidad</h1>
            <p className="text-andean-100">Pregunta, comparte y aprende con otros estudiantes</p>
          </div>
          <button
            onClick={() => user ? setShowForm(true) : navigate('/auth')}
            className="shrink-0 flex items-center gap-2 bg-white text-andean-700 font-semibold px-4 py-2.5 rounded-full hover:bg-andean-50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Nueva pregunta
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* New post form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stone-800">Nueva pregunta o publicación</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Curso relacionado *</label>
                <select
                  value={form.courseSlug}
                  onChange={(e) => setForm((f) => ({ ...f, courseSlug: e.target.value }))}
                  required
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 bg-white"
                >
                  <option value="">Selecciona un curso...</option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Título de tu pregunta *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="¿Qué quieres preguntar?"
                  required
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Descripción *</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Explica tu pregunta con más detalle..."
                  required
                  rows={4}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-andean-300 resize-none"
                />
              </div>
              {error && <p className="text-earth-600 text-sm">⚠️ {error}</p>}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-andean-600 hover:bg-andean-700 disabled:opacity-60 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publicar pregunta
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Cargando foros...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">El foro está vacío</p>
            <p className="text-sm mb-6">¡Sé el primero en hacer una pregunta!</p>
            <button
              onClick={() => user ? setShowForm(true) : navigate('/auth')}
              className="inline-flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Hacer primera pregunta
            </button>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/foros/${post.id}`}
              className="block bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md hover:border-andean-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-andean-100 text-andean-700 px-2.5 py-0.5 rounded-full font-medium">
                      {post.course?.title ?? 'General'}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-800 group-hover:text-andean-700 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-2">{post.body}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-andean-400 shrink-0 mt-1 transition-colors" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
                <span className="font-medium text-stone-600">{post.user.name}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post._count?.replies ?? 0} respuestas</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
