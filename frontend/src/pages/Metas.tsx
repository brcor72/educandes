import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Target, TrendingUp, Loader2, ChevronRight } from 'lucide-react';
import { api, Stats, Course, Progress } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../context/LanguageContext';
import AudioButton from '../components/AudioButton';

interface CourseWithProgress extends Course { progress: Progress | null }

export default function Metas() {
  const { user } = useAuth();
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, allCourses] = await Promise.all([
          api.get<Stats>('/stats'),
          api.get<Course[]>('/courses'),
        ]);
        setStats(s);

        if (user) {
          const withProgress = await Promise.all(
            allCourses.map(async c => {
              try {
                const prog = await api.get<Progress>(`/courses/${c.slug}/progress`);
                return { ...c, progress: prog };
              } catch { return { ...c, progress: null }; }
            })
          );
          // Mostrar solo cursos con progreso > 0, o si está en curso
          setCourses(withProgress.filter(c => (c.progress?.completedLessons?.length ?? 0) > 0).slice(0, 6));
        }
      } catch {}
      setLoading(false);
    };
    loadData();
  }, [user]);

  const missionText = 'Empoderar a las comunidades andinas rurales con herramientas tecnológicas accesibles, en sus propios idiomas, para mejorar su vida productiva y económica de forma sostenible.';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-andean-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-andean-200" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {user ? `${t('goals', 'stats')}, ${user.name.split(' ')[0]}` : t('goals', 'title')}
            </h1>
          </div>
          <p className="text-andean-100 text-lg ml-11">
            {user ? 'Sigue avanzando — cada lección te acerca a tus metas' : 'Tu progreso y los objetivos de EducAndes'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* Personal dashboard — solo si está logueado */}
        {user && (
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-andean-600" />
              Mi progreso por curso
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-andean-400" />
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(c => (
                  <Link key={c.id} to={`/curso/${c.slug}`}
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 hover:shadow-md hover:border-andean-200 transition-all group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-stone-800 group-hover:text-andean-700 transition-colors">{c.title}</h3>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-andean-400 shrink-0 mt-1 transition-colors" />
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                        <span>{c.progress?.completedLessons.length ?? 0} de {c.progress?.totalLessons ?? 0} lecciones</span>
                        <span className="font-semibold text-andean-600">{c.progress?.percentage ?? 0}%</span>
                      </div>
                      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${(c.progress?.percentage ?? 0) === 100 ? 'bg-forest-500' : 'bg-andean-500'}`}
                          style={{ width: `${c.progress?.percentage ?? 0}%` }}
                        />
                      </div>
                    </div>
                    {(c.progress?.percentage ?? 0) === 100 && (
                      <p className="text-xs text-forest-600 font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> ¡Curso completado! 🎉
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
                <BookOpen className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-500 mb-4">Aún no has comenzado ningún curso</p>
                <Link to="/cursos"
                  className="inline-flex items-center gap-2 bg-andean-600 hover:bg-andean-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Ver cursos disponibles <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Platform stats */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
            <Users className="w-5 h-5 text-andean-600" />
            {t('goals', 'stats')} — EducAndes
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-7 h-7 animate-spin text-andean-400" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: t('goals', 'students'), value: stats?.totalUsers ?? 0, color: 'text-andean-600', bg: 'bg-andean-50' },
                { icon: BookOpen, label: t('goals', 'activeCourses'), value: stats?.totalCourses ?? 0, color: 'text-forest-600', bg: 'bg-forest-50' },
                { icon: Award, label: t('goals', 'completed'), value: stats?.totalLessonsCompleted ?? 0, color: 'text-earth-600', bg: 'bg-earth-50' },
                { icon: Target, label: 'Comunidades', value: stats?.communities ?? 0, color: 'text-andean-700', bg: 'bg-andean-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl border border-stone-100 p-5 text-center`}>
                  <s.icon className={`w-7 h-7 mx-auto mb-2 ${s.color}`} />
                  <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value.toLocaleString()}</p>
                  <p className="text-stone-500 text-sm leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Metas 2025 */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-5">Metas 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '🎯', value: '500 familias', desc: 'Familias rurales capacitadas en tecnología', progress: 23, color: 'bg-andean-500' },
              { icon: '🏘️', value: '20 comunidades', desc: 'Comunidades andinas con laboratorios digitales', progress: 60, color: 'bg-forest-500' },
              { icon: '📚', value: '15 cursos', desc: 'Cursos disponibles en 4 idiomas', progress: 53, color: 'bg-earth-500' },
              { icon: '🤝', value: '30 facilitadores', desc: 'Facilitadores locales entrenados', progress: 40, color: 'bg-andean-600' },
            ].map(g => (
              <div key={g.value} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{g.icon}</span>
                  <div>
                    <p className="font-bold text-stone-800 text-lg">{g.value}</p>
                    <p className="text-sm text-stone-500">{g.desc}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                  <span>Avance</span><span>{g.progress}%</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-xl font-bold text-stone-800 mb-5">Idiomas de la plataforma</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { lang: 'Español',       native: 'Español',      flag: '🇵🇪', region: 'Todo el Perú' },
              { lang: 'Quechua',       native: 'Runasimi',     flag: '🏔️', region: 'Cusco, Puno, Ayacucho' },
              { lang: 'Aymara',        native: 'Aymara aru',   flag: '🌊', region: 'Puno, Tacna' },
              { lang: 'Shipibo-Konibo',native: 'Shipi Zoribaon',flag: '🌿', region: 'Ucayali' },
            ].map(l => (
              <div key={l.lang} className="bg-andean-50 rounded-xl p-4 text-center border border-andean-100">
                <span className="text-3xl block mb-2">{l.flag}</span>
                <p className="font-bold text-stone-800 text-sm">{l.native}</p>
                <p className="text-xs text-stone-500 mt-0.5">{l.lang}</p>
                <p className="text-xs text-andean-600 mt-1">{l.region}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-andean-700 text-white rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <AudioButton text={missionText} size="sm" className="!bg-andean-600 !border-andean-500 !text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('goals', 'mission')}</h2>
          <p className="text-andean-100 text-lg leading-relaxed max-w-2xl mx-auto">"{missionText}"</p>
          <p className="text-andean-300 text-sm mt-4">— EducAndes ONG · Sierra del Perú</p>
        </section>
      </div>
    </div>
  );
}
