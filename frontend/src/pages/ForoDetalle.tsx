import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send, Loader2, Clock } from 'lucide-react';
import { api, ForumPost } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function ForoDetalle() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<ForumPost>(`/forums/${id}`)
      .then(setPost)
      .catch(() => navigate('/foros'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!replyBody.trim()) return;
    setSubmitting(true);
    try {
      const reply = await api.post<any>(`/forums/${id}/replies`, { body: replyBody });
      setPost((p) => p ? { ...p, replies: [...(p.replies ?? []), reply] } : p);
      setReplyBody('');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-andean-500" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-andean-700 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/foros" className="inline-flex items-center gap-1 text-andean-200 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver a foros
          </Link>
          <span className="text-xs bg-andean-600 text-andean-100 px-2.5 py-1 rounded-full mb-3 inline-block">
            {post.course?.title}
          </span>
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Original post */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-andean-100 rounded-full flex items-center justify-center text-andean-700 font-bold text-sm">
              {post.user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">{post.user.name}</p>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />{formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-stone-700 leading-relaxed">{post.body}</p>
        </div>

        {/* Replies */}
        {post.replies && post.replies.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-stone-500 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {post.replies.length} {post.replies.length === 1 ? 'respuesta' : 'respuestas'}
            </h2>
            <div className="space-y-3">
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-forest-100 rounded-full flex items-center justify-center text-forest-700 font-bold text-xs">
                      {reply.user.name[0].toUpperCase()}
                    </div>
                    <p className="font-medium text-stone-700 text-sm">{reply.user.name}</p>
                    <p className="text-xs text-stone-400 ml-auto">{formatDate(reply.createdAt)}</p>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed pl-9">{reply.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply form */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">
            {user ? 'Escribe una respuesta' : 'Inicia sesión para responder'}
          </h3>
          {user ? (
            <form onSubmit={submitReply} className="space-y-3">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={4}
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-andean-300 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !replyBody.trim()}
                  className="flex items-center gap-2 bg-andean-600 hover:bg-andean-700 disabled:opacity-60 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publicar respuesta
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <Link to="/auth" className="inline-flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                Iniciar sesión para responder
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
