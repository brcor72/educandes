import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, Lock, CheckCircle2, Circle, ChevronRight, Loader2 } from 'lucide-react';
import { api, Course, Progress } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import YachayChat from '../components/YachayChat';
import AudioButton from '../components/AudioButton';

export default function CursoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      api.get<Course>(`/courses/${slug}`),
      user ? api.get<Progress>(`/courses/${slug}/progress`) : Promise.resolve(null),
    ])
      .then(([c, p]) => {
        setCourse(c);
        setProgress(p);
        if (c.lessons?.length) setActiveLesson(c.lessons[0].id);
      })
      .catch(() => navigate('/cursos'))
      .finally(() => setLoading(false));
  }, [slug, user, navigate]);

  async function completeLesson(lessonId: number) {
    if (!user || !slug) {
      navigate('/auth');
      return;
    }
    setCompleting(true);
    try {
      await api.post(`/courses/${slug}/lessons/${lessonId}/complete`, {});
      const p = await api.get<Progress>(`/courses/${slug}/progress`);
      setProgress(p);
      // Move to next lesson
      if (course?.lessons) {
        const idx = course.lessons.findIndex((l) => l.id === lessonId);
        if (idx < course.lessons.length - 1) {
          setActiveLesson(course.lessons[idx + 1].id);
        }
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-andean-500" />
      </div>
    );
  }

  if (!course) return null;

  const currentLesson = course.lessons?.find((l) => l.id === activeLesson);
  const isCompleted = (id: number) => progress?.completedLessons.includes(id) ?? false;
  const isLocked = (index: number) => {
    if (index === 0) return false;
    if (!user) return index > 0;
    const prev = course.lessons?.[index - 1];
    return prev ? !isCompleted(prev.id) : false;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-andean-700 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/cursos" className="inline-flex items-center gap-1 text-andean-200 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver a cursos
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-start gap-3 mb-4">
            <p className="text-andean-100 flex-1">{course.description}</p>
            <AudioButton text={course.description} size="sm" className="shrink-0 !bg-andean-600 !border-andean-500 !text-white" />
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-andean-200">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.durationWeeks} semanas</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons?.length ?? 0} lecciones</span>
            <span className="capitalize bg-andean-600 px-2 py-0.5 rounded-full">{course.difficulty}</span>
          </div>

          {/* Progress */}
          {user && progress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Tu progreso</span>
                <span>{progress.percentage}% · {progress.completedLessons.length} de {progress.totalLessons} clases</span>
              </div>
              <div className="h-2.5 bg-andean-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-4 border-b border-stone-100 font-semibold text-stone-700">
                Lecciones del curso
              </div>
              <div className="divide-y divide-stone-50">
                {course.lessons?.map((lesson, idx) => {
                  const locked = isLocked(idx);
                  const done = isCompleted(lesson.id);
                  const active = activeLesson === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !locked && setActiveLesson(lesson.id)}
                      disabled={locked}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                        active ? 'bg-andean-50 border-l-4 border-andean-500' :
                        locked ? 'opacity-50 cursor-not-allowed' :
                        'hover:bg-stone-50 cursor-pointer'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-forest-500" />
                        ) : locked ? (
                          <Lock className="w-5 h-5 text-stone-300" />
                        ) : (
                          <Circle className={`w-5 h-5 ${active ? 'text-andean-500' : 'text-stone-300'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug ${active ? 'text-andean-700' : 'text-stone-700'}`}>
                          {idx + 1}. {lesson.title}
                        </p>
                        {lesson.isPractical && (
                          <span className="text-xs text-earth-600 font-medium mt-0.5 block">📝 Caso práctico</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lesson content */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-andean-600 font-medium mb-1">
                      Lección {(course.lessons?.findIndex((l) => l.id === currentLesson.id) ?? 0) + 1} de {course.lessons?.length}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-800">{currentLesson.title}</h2>
                    {currentLesson.isPractical && (
                      <span className="inline-block mt-1 text-xs bg-earth-100 text-earth-700 px-2.5 py-0.5 rounded-full font-medium">
                        📝 Caso práctico
                      </span>
                    )}
                  </div>
                  {isCompleted(currentLesson.id) && (
                    <div className="shrink-0 flex items-center gap-1 text-forest-600 bg-forest-50 px-3 py-1.5 rounded-full text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Completada
                    </div>
                  )}
                </div>

                {currentLesson.description && (
                  <p className="text-stone-600 mb-6 text-base leading-relaxed">{currentLesson.description}</p>
                )}

                <div className="bg-andean-50 rounded-xl p-5 mb-6">
                  <p className="text-stone-700 leading-relaxed">
                    {currentLesson.content ?? 'Contenido de esta lección próximamente.'}
                  </p>
                </div>

                {/* Audio — Web Speech API */}
                {currentLesson.content && (
                  <div className="bg-stone-50 rounded-xl p-4 mb-6 flex items-center gap-3 border border-stone-200">
                    <div className="w-10 h-10 bg-andean-100 rounded-full flex items-center justify-center text-xl">🔊</div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-700 text-sm">Escuchar esta lección</p>
                      <p className="text-xs text-stone-400">Reproducción de voz según tu idioma</p>
                    </div>
                    <AudioButton text={currentLesson.content} size="md" />
                  </div>
                )}

                {/* Actions */}
                {!user ? (
                  <div className="bg-andean-50 border border-andean-200 rounded-xl p-4 text-center">
                    <p className="text-andean-700 font-medium mb-2">Inicia sesión para guardar tu progreso</p>
                    <Link to="/auth" className="inline-flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
                      Iniciar sesión
                    </Link>
                  </div>
                ) : !isCompleted(currentLesson.id) ? (
                  <button
                    onClick={() => completeLesson(currentLesson.id)}
                    disabled={completing}
                    className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Marcar como completada
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center justify-center gap-2 bg-forest-50 text-forest-700 font-medium py-3 px-4 rounded-xl border border-forest-200">
                      <CheckCircle2 className="w-5 h-5" /> ¡Lección completada!
                    </div>
                    {course.lessons && course.lessons.findIndex((l) => l.id === currentLesson.id) < course.lessons.length - 1 && (
                      <button
                        onClick={() => {
                          const idx = course.lessons!.findIndex((l) => l.id === currentLesson.id);
                          setActiveLesson(course.lessons![idx + 1].id);
                        }}
                        className="flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white px-5 py-3 rounded-xl transition-colors font-medium"
                      >
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center text-stone-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Selecciona una lección para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <YachayChat courseSlug={slug} />
    </div>
  );
}
