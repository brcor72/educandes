import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Course } from '../lib/api';

const CATEGORY_LABELS: Record<string, string> = {
  'vida-campo': '🌾 Vida en el campo',
  'negocio-dinero': '💰 Negocio y dinero',
  'primeros-pasos': '💻 Primeros pasos',
  'energia-recursos': '☀️ Energía y recursos',
};

const DIFFICULTY_STYLES: Record<string, string> = {
  inicial: 'bg-forest-100 text-forest-700',
  intermedio: 'bg-andean-100 text-andean-700',
  avanzado: 'bg-earth-100 text-earth-700',
};

const FALLBACK_IMAGES: Record<string, string> = {
  ganaderia: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&auto=format&fit=crop',
  cultivo: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop',
  clima: 'https://images.unsplash.com/photo-1504608524841-42584120d093?w=400&auto=format&fit=crop',
  tierras: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop',
  textiles: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop',
  cuentas: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop',
  computadora: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&auto=format&fit=crop',
  solar: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop',
};

interface Props {
  course: Course;
  progress?: number;
}

export default function CourseCard({ course, progress }: Props) {
  const imgSrc = course.imageUrl ?? FALLBACK_IMAGES[course.slug] ?? 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-stone-100 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={imgSrc}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-stone-600">
          {CATEGORY_LABELS[course.category] ?? course.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-stone-800 text-base leading-snug group-hover:text-andean-700 transition-colors">
            {course.title}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${DIFFICULTY_STYLES[course.difficulty] ?? 'bg-stone-100 text-stone-600'}`}>
            {course.difficulty}
          </span>
        </div>

        <p className="text-stone-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-stone-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.durationWeeks} sem.
          </span>
          {course._count && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {course._count.lessons} clases
            </span>
          )}
        </div>

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Link
          to={`/curso/${course.slug}`}
          className="flex items-center justify-center gap-2 bg-andean-600 hover:bg-andean-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm group/btn"
        >
          Entrar al curso
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
