import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { api, Course } from '../lib/api';
import CourseCard from '../components/CourseCard';

const CATEGORIES = [
  { id: 'all', label: '📚 Todos' },
  { id: 'vida-campo', label: '🌾 Vida en el campo' },
  { id: 'negocio-dinero', label: '💰 Negocio y dinero' },
  { id: 'primeros-pasos', label: '💻 Primeros pasos' },
  { id: 'energia-recursos', label: '☀️ Energía y recursos' },
];

export default function Cursos() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.get<Course[]>('/courses')
      .then(setCourses)
      .catch(() => setError('No se pudieron cargar los cursos. ¿Está corriendo el servidor?'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchCat = category === 'all' || c.category === category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.slice(1).reduce<Record<string, Course[]>>((acc, cat) => {
    acc[cat.id] = filtered.filter((c) => c.category === cat.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-andean-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Todos los cursos</h1>
          <p className="text-andean-100 text-lg">Gratuitos · En tu idioma · Para tu comunidad</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cursos..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-andean-300 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-andean-600 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-andean-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Cargando cursos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-earth-50 border border-earth-200 text-earth-700 rounded-xl p-6 text-center">
            <p className="font-medium mb-2">⚠️ {error}</p>
            <p className="text-sm">Asegúrate de que el backend esté corriendo con <code className="bg-earth-100 px-1 rounded">npm run dev</code> en la carpeta <code className="bg-earth-100 px-1 rounded">backend/</code></p>
          </div>
        )}

        {/* Courses */}
        {!loading && !error && (
          <>
            {category === 'all' ? (
              <>
                {CATEGORIES.slice(1).map((cat) =>
                  grouped[cat.id]?.length > 0 ? (
                    <div key={cat.id} className="mb-12">
                      <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
                        {cat.label}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {grouped[cat.id].map((c) => (
                          <CourseCard key={c.id} course={c} />
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
                {filtered.length === 0 && (
                  <p className="text-center text-stone-400 py-16 text-lg">No se encontraron cursos con ese criterio.</p>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-full text-center text-stone-400 py-16 text-lg">No hay cursos en esta categoría todavía.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
