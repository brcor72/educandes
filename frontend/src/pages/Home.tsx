import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Mountain } from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { useLang } from '../context/LanguageContext';

const FEATURES = [
  { icon: '📱', title: 'En tu celular', desc: 'Aprende desde tu smartphone, sin necesitar computadora.' },
  { icon: '🔊', title: 'Con audio', desc: 'Cada lección tiene opción de escuchar el contenido en voz alta.' },
  { icon: '🌐', title: '4 idiomas', desc: 'Contenido en Español, Quechua, Aymara y Shipibo-Konibo.' },
  { icon: '🤝', title: 'Facilitadores', desc: 'Personas de tu comunidad te apoyan en cada paso del camino.' },
];

const TESTIMONIALS = [
  {
    name: 'María Quispe',
    community: 'Puno',
    text: 'Gracias a EducAndes aprendí a registrar mis alpacas en el celular. Ahora sé exactamente cuántas tengo y cuánto gano.',
    course: 'Ganadería inteligente',
  },
  {
    name: 'Julián Mamani',
    community: 'Cusco',
    text: 'El curso de ventas por internet me ayudó a vender mis tejidos hasta Lima. Mis hijos están muy orgullosos.',
    course: 'Venta de textiles',
  },
  {
    name: 'Elena Flores',
    community: 'Apurímac',
    text: 'Nunca había usado una computadora. En 4 semanas ya sé buscar información y usar el correo. ¡Sí se puede!',
    course: 'Primeros pasos digitales',
  },
];

export default function Home() {
  const { t } = useLang();
  const heroText = 'Cursos gratuitos de tecnología en tu idioma: Español, Quechua, Aymara y Shipibo-Konibo. Aprende a cuidar tu ganado, vender tus productos y manejar tu dinero con tu celular.';
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-andean-800 via-andean-700 to-earth-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-andean-300 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-earth-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Mountain className="w-6 h-6 text-andean-200" />
              <span className="text-andean-200 font-medium text-sm tracking-wide uppercase">Sierra del Perú</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {t('home', 'hero').split(' ').slice(0, 2).join(' ')}
              <span className="text-andean-200"> {t('home', 'hero').split(' ').slice(2, 5).join(' ')}</span>
              <br />
              {t('home', 'hero').split(' ').slice(5).join(' ')}
            </h1>
            <p className="text-lg md:text-xl text-andean-100 leading-relaxed mb-4 max-w-2xl">
              {heroText}
            </p>
            <div className="mb-6">
              <AudioButton text={heroText} size="sm" className="!bg-andean-600 !border-andean-500 !text-white" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cursos"
                className="inline-flex items-center justify-center gap-2 bg-white text-andean-700 font-bold py-3 px-8 rounded-full hover:bg-andean-50 transition-colors text-lg shadow-lg"
              >
                Ver cursos gratis
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors text-lg"
              >
                Crear mi cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-andean-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-andean-200">8+</p>
              <p className="text-sm text-andean-100 mt-1">Cursos gratuitos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-andean-200">4</p>
              <p className="text-sm text-andean-100 mt-1">Idiomas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-andean-200">12</p>
              <p className="text-sm text-andean-100 mt-1">Comunidades</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-andean-200">100%</p>
              <p className="text-sm text-andean-100 mt-1">Gratis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Diseñado para la sierra peruana
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Cada detalle fue pensado para que puedas aprender sin importar dónde estés o qué idioma hablas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-andean-50 border border-andean-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course categories preview */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">¿Qué quieres aprender?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🌾', label: 'Vida en el campo', desc: 'Ganadería, cultivos y clima andino', color: 'bg-forest-50 border-forest-200 text-forest-700' },
              { emoji: '💰', label: 'Negocio y dinero', desc: 'Ventas, alquiler y contabilidad', color: 'bg-andean-50 border-andean-200 text-andean-700' },
              { emoji: '💻', label: 'Primeros pasos', desc: 'Computadora e internet básico', color: 'bg-earth-50 border-earth-200 text-earth-700' },
              { emoji: '☀️', label: 'Energía y recursos', desc: 'Paneles solares para tu hogar', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to="/cursos"
                className={`border-2 rounded-2xl p-6 hover:shadow-md transition-all group ${cat.color}`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-bold text-base mb-1">{cat.label}</h3>
                <p className="text-sm opacity-75">{cat.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium">
                  Ver cursos <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">Lo que dicen los estudiantes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-andean-50 border border-andean-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">"</div>
                <p className="text-stone-700 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-stone-800">{t.name}</p>
                    <p className="text-sm text-stone-500">{t.community}</p>
                  </div>
                  <span className="text-xs bg-andean-200 text-andean-800 px-2.5 py-1 rounded-full">
                    {t.course}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-andean-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Empieza a aprender hoy, es gratis</h2>
          <p className="text-andean-100 mb-8 text-lg">
            Regístrate en minutos y accede a todos los cursos sin costo.
          </p>
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 bg-white text-andean-700 font-bold py-3 px-10 rounded-full hover:bg-andean-50 transition-colors text-lg shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            Ver todos los cursos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mountain className="w-5 h-5 text-andean-400" />
            <span className="text-white font-bold">EducAndes</span>
          </div>
          <p className="text-sm">Educación tecnológica gratuita para comunidades andinas · Sierra del Perú</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link to="/cursos" className="hover:text-white transition-colors">Cursos</Link>
            <Link to="/foros" className="hover:text-white transition-colors">Foros</Link>
            <Link to="/metas" className="hover:text-white transition-colors">Metas</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
