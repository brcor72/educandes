// EducAndes - Sistema de traducción para 4 idiomas
export type Lang = 'es' | 'qu' | 'ay' | 'sh';

export const LANGS: { code: Lang; label: string; greeting: string; flag: string }[] = [
  { code: 'es', label: 'Español',           greeting: '¡Hola!',         flag: '🇵🇪' },
  { code: 'qu', label: 'Runasimi (Quechua)', greeting: '¡Allillanchu!',  flag: '🏔️' },
  { code: 'ay', label: 'Aymara',             greeting: '¡Kamisaraki!',   flag: '🌊' },
  { code: 'sh', label: 'Shipibo-Konibo',     greeting: '¡Jakon raoma!',  flag: '🌿' },
];

type Translations = {
  nav: { courses: string; forums: string; goals: string; profile: string; login: string; logout: string };
  home: { hero: string; heroSub: string; seeCourses: string; createAccount: string; freeCourses: string; languages: string; communities: string; free: string };
  auth: { login: string; register: string; dni: string; password: string; name: string; community: string; phone: string; enter: string; create: string; dniHint: string; passHint: string; changeLang: string };
  courses: { title: string; all: string; search: string; enter: string; weeks: string; lessons: string };
  lesson: { progress: string; complete: string; completed: string; next: string; listen: string; loginToSave: string };
  forums: { title: string; newQuestion: string; replies: string; post: string; course: string };
  goals: { title: string; stats: string; students: string; activeCourses: string; completed: string; mission: string };
  profile: { title: string; edit: string; save: string; changePass: string; currentPass: string; newPass: string; myProgress: string; lessonsCompleted: string; posts: string; member: string };
  tutorial: { step1Title: string; step1Body: string; step2Title: string; step2Body: string; step3Title: string; step3Body: string; step4Title: string; step4Body: string; step5Title: string; step5Body: string; next: string; prev: string; finish: string; skip: string };
  audio: { listen: string; stop: string };
};

const translations: Record<Lang, Translations> = {
  es: {
    nav: { courses: 'Cursos', forums: 'Foros', goals: 'Metas', profile: 'Perfil', login: 'Entrar', logout: 'Salir' },
    home: { hero: 'Tecnología para las comunidades andinas', heroSub: 'Cursos gratuitos en tu idioma: Español, Quechua, Aymara y Shipibo-Konibo. Aprende a cuidar tu ganado, vender tus productos y manejar tu dinero.', seeCourses: 'Ver cursos gratis', createAccount: 'Crear mi cuenta', freeCourses: 'Cursos gratuitos', languages: 'Idiomas', communities: 'Comunidades', free: 'Gratis' },
    auth: { login: 'Iniciar sesión', register: 'Crear cuenta', dni: 'DNI (8 dígitos)', password: 'Contraseña', name: 'Nombre completo', community: 'Comunidad o distrito', phone: 'WhatsApp / Teléfono', enter: 'Entrar a mis cursos', create: 'Crear mi cuenta gratis', dniHint: 'Ej: 12345678', passHint: 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial', changeLang: 'Cambiar idioma' },
    courses: { title: 'Todos los cursos', all: '📚 Todos', search: 'Buscar cursos...', enter: 'Entrar al curso', weeks: 'sem.', lessons: 'clases' },
    lesson: { progress: 'Tu progreso', complete: 'Marcar como completada', completed: '¡Lección completada!', next: 'Siguiente', listen: 'Escuchar', loginToSave: 'Inicia sesión para guardar tu progreso' },
    forums: { title: 'Foros de la comunidad', newQuestion: 'Nueva pregunta', replies: 'respuestas', post: 'Publicar', course: 'Curso relacionado' },
    goals: { title: 'Mis Metas', stats: 'Mi progreso', students: 'Estudiantes', activeCourses: 'Cursos activos', completed: 'Lecciones completadas', mission: 'Nuestra misión' },
    profile: { title: 'Mi Perfil', edit: 'Editar perfil', save: 'Guardar cambios', changePass: 'Cambiar contraseña', currentPass: 'Contraseña actual', newPass: 'Nueva contraseña', myProgress: 'Mi progreso', lessonsCompleted: 'Lecciones completadas', posts: 'Publicaciones', member: 'Miembro desde' },
    tutorial: { step1Title: '¡Bienvenido/a a EducAndes!', step1Body: 'Somos una plataforma educativa gratuita para comunidades andinas. Aquí aprenderás tecnología en tu idioma para mejorar tu vida y trabajo.', step2Title: 'Explora los cursos', step2Body: 'Tenemos 8 cursos sobre ganadería, cultivos, ventas, energía solar y más. Todos son gratuitos y puedes avanzar a tu ritmo.', step3Title: 'Aprende a tu ritmo', step3Body: 'Cada curso tiene lecciones con texto, audio y casos prácticos. Puedes escuchar el contenido si prefieres no leer.', step4Title: 'Únete a los foros', step4Body: 'Haz preguntas, comparte lo que sabes y conecta con otros estudiantes de tu comunidad y de todo el Perú.', step5Title: '¡Estás listo/a para empezar!', step5Body: 'Tu cuenta ya está activa. Elige un curso y comienza hoy mismo. ¡El aprendizaje es el mejor camino hacia adelante!', next: 'Siguiente', prev: 'Anterior', finish: '¡Empezar ahora!', skip: 'Omitir tutorial' },
    audio: { listen: 'Escuchar', stop: 'Detener' },
  },
  qu: {
    nav: { courses: 'Yachakuy', forums: 'Rimanakuy', goals: 'Munayniy', profile: 'Ñuqamanta', login: 'Yaykuy', logout: 'Lluksiniy' },
    home: { hero: 'Teknolohiyan andina llaqtakunapaq', heroSub: 'Qespi yachachiy qampa simikipi: Español, Runasimi, Aymara. Uywa, hallpa, qolqe imatapis yachakuy.', seeCourses: 'Yachakuykunata qhaway', createAccount: 'Cuenta ruwakuy', freeCourses: 'Qespi yachakuykuna', languages: 'Simikuna', communities: 'Llaqtakuna', free: 'Qespi' },
    auth: { login: 'Yaykuy', register: 'Qelqakuy', dni: 'DNI (8 número)', password: 'Claveyki', name: 'Sutikikim', community: 'Llaqtayki', phone: 'Teléfono', enter: 'Yachakuykunaman yaykuy', create: 'Cuenta ruwakuy', dniHint: 'Ej: 12345678', passHint: 'Mín 8, 1 hatun qelqa, 1 número', changeLang: 'Simi tikray' },
    courses: { title: 'Yachakuykuna', all: '📚 Llapan', search: 'Maskay...', enter: 'Yaykuy', weeks: 'semana', lessons: 'yachakuy' },
    lesson: { progress: 'Yachakuyki', complete: 'Tukuy niypaq', completed: '¡Tukurqanki!', next: 'Qatiqnin', listen: 'Uyariy', loginToSave: 'Yaykuy yachakuyniyta waqaychananpaq' },
    forums: { title: 'Rimanakuy', newQuestion: 'Tapuy', replies: 'kutipay', post: 'Willariy', course: 'Yachakuy' },
    goals: { title: 'Munayniy', stats: 'Yachakuyni', students: 'Yachakuqkuna', activeCourses: 'Yachakuykuna', completed: 'Tukurasqa', mission: 'Munayniy' },
    profile: { title: 'Ñuqamanta', edit: 'Tikray', save: 'Waqaychay', changePass: 'Clave tikray', currentPass: 'Kanan clave', newPass: 'Mosoj clave', myProgress: 'Yachakuyni', lessonsCompleted: 'Tukurasqa', posts: 'Willakuykuna', member: 'Yaykurqani' },
    tutorial: { step1Title: '¡Allin Chayamunki EducAndespi!', step1Body: 'Qespi yachachiy plataforma kanchik andina llaqtakunapaq. Kaypi teknolohiyta yachakunkimá qampa simikipi.', step2Title: 'Yachakuykunata qhaway', step2Body: '8 yachakuy tiyan: uywa, hallpa, rantiykuy, intipata energía. Llapan qespim, qampa minutuykipi purikuy.', step3Title: 'Qampa minutuykipi yachakuy', step3Body: 'Sapa yachakuypi qelqa, uyariy ima tiyan. Mana leyta munankichu chayqa uyariy atinkimá.', step4Title: 'Rimanakuypi yaykuy', step4Body: 'Tapuy, riqsisqaykita willay, sapa llaqtamanta yachakuqkunawan rimanakuy.', step5Title: '¡Qallarinapaq kachkanki!', step5Body: 'Cuentayki allim kachkan. Yachakuy akllay, kunan punchaw qallari!', next: 'Qatiq', prev: 'Ñawpaq', finish: '¡Qallari!', skip: 'Pasay' },
    audio: { listen: 'Uyariy', stop: 'Sayay' },
  },
  ay: {
    nav: { courses: 'Yatiqaña', forums: 'Aruskipaña', goals: 'Munaña', profile: 'Nanaka', login: 'Mantaña', logout: 'Mistuña' },
    home: { hero: 'Tecnología Andes markanakataki', heroSub: 'Qhari yatiqaña simi aruskiptaxa: Español, Aymara, Runasimi. Uywa, hallpa, qullqi yatiqaña.', seeCourses: 'Yatiqañanaka uñt\'aña', createAccount: 'Cuenta lurataña', freeCourses: 'Qhari yatiqañanaka', languages: 'Siminaka', communities: 'Markanaka', free: 'Qhari' },
    auth: { login: 'Mantaña', register: 'Qelqataña', dni: 'DNI (8 número)', password: 'Clavexa', name: 'Sutimawa', community: 'Markama', phone: 'Teléfono', enter: 'Yatiqañaruwa mantaña', create: 'Qhari cuenta lurataña', dniHint: 'Ej: 12345678', passHint: 'Mín 8, 1 paya qelqa', changeLang: 'Simi tikraña' },
    courses: { title: 'Yatiqañanaka', all: '📚 Taqi', search: 'Maskhaña...', enter: 'Mantaña', weeks: 'semana', lessons: 'yatiqaña' },
    lesson: { progress: 'Yatiqañama', complete: 'Tukuyaña', completed: '¡Tukuyatayna!', next: 'Qhipaxa', listen: 'Uywaña', loginToSave: 'Mantaña yatiqañama waqichanataki' },
    forums: { title: 'Aruskipaña', newQuestion: 'Jisk\'aña', replies: 'kutiyiri', post: 'Willtaña', course: 'Yatiqaña' },
    goals: { title: 'Munaña', stats: 'Yatiqañama', students: 'Yatiqirinaka', activeCourses: 'Yatiqañanaka', completed: 'Tukuyata', mission: 'Munaña' },
    profile: { title: 'Nanaka', edit: 'Tikraña', save: 'Waqichaña', changePass: 'Clave tikraña', currentPass: 'Jichha clave', newPass: 'Juk clave', myProgress: 'Yatiqañama', lessonsCompleted: 'Tukuyata', posts: 'Willtanaka', member: 'Mantatayna' },
    tutorial: { step1Title: '¡Suma Jutasmawa EducAndesaru!', step1Body: 'Qhari yatiqaña plataformawa Andes markanakataki. Kaxa tecnología yatiqañatawa simi aruskiptaxa.', step2Title: 'Yatiqañanaka uñt\'aña', step2Body: '8 yatiqaña utji: uywa, hallpa, aljaña, inti energía. Taqi qaritwa, ukhamaraki jayp\'u aruskiptaxa.', step3Title: 'Jayp\'u aruskiptaxa yatiqaña', step3Body: 'Sapa yatiqañana qelqa, uywaña utji. Leer munktati uywañata atxasma.', step4Title: 'Aruskipaña mantaña', step4Body: 'Jisk\'a, yatiqatasxa willtaña, markanaka yatiqirinakampi aruskipaña.', step5Title: '¡Qalltañataki kanchismawa!', step5Body: 'Cuentama alltanwa. Yatiqaña akllaña, jichha qalltaña!', next: 'Qhipa', prev: 'Nayriri', finish: '¡Qalltaña!', skip: 'Phuqaña' },
    audio: { listen: 'Uywaña', stop: 'Sayaña' },
  },
  sh: {
    nav: { courses: 'Benibaon', forums: 'Yoyo', goals: 'Jato', profile: 'Ea', login: 'Hoaya', logout: 'Betsa' },
    home: { hero: 'Tecnología Andes nete jakonbireskin', heroSub: 'Jakon benibaon ea sinan: Español, Shipibo, Quechua. Jawen rao, jemara, pei benibaon.', seeCourses: 'Benibaon uinma', createAccount: 'Cuenta ruati', freeCourses: 'Jakon benibaon', languages: 'Sinankabo', communities: 'Nete', free: 'Jakon' },
    auth: { login: 'Hoaya', register: 'Qelqati', dni: 'DNI (8 número)', password: 'Clave', name: 'Ea bena', community: 'Nete', phone: 'Teléfono', enter: 'Benibaonbi hoaya', create: 'Jakon cuenta ruati', dniHint: 'Ej: 12345678', passHint: 'Mín 8, 1 paya qelqa', changeLang: 'Sinan tikia' },
    courses: { title: 'Benibaon', all: '📚 Jato', search: 'Masko...', enter: 'Hoaya', weeks: 'semana', lessons: 'benibo' },
    lesson: { progress: 'Ea benibaon', complete: 'Tukuti', completed: '¡Tukuai!', next: 'Ixon', listen: 'Nointi', loginToSave: 'Hoaya ea benibo waqiati' },
    forums: { title: 'Yoyo', newQuestion: 'Tapuai', replies: 'kutipai', post: 'Willati', course: 'Benibo' },
    goals: { title: 'Jato', stats: 'Ea benibaon', students: 'Benibokabo', activeCourses: 'Benibaon', completed: 'Tukuai', mission: 'Jato' },
    profile: { title: 'Ea', edit: 'Tikia', save: 'Waqiati', changePass: 'Clave tikia', currentPass: 'Jato clave', newPass: 'Juk clave', myProgress: 'Ea benibaon', lessonsCompleted: 'Tukuai', posts: 'Yoyokabo', member: 'Hoayaai' },
    tutorial: { step1Title: '¡Jakon Hoaya EducAndes nete!', step1Body: 'Jakon benibaon plataforma Andes netekabo. Kaxa tecnología benibaon ea sinan.', step2Title: 'Benibaon uinma', step2Body: '8 benibaon: rao, jemara, aljai, inti energía. Jatokidi jakon, ea jayabi.', step3Title: 'Ea jayabi benibaon', step3Body: 'Sapa benibona qelqa, nointi utji. Leer mankidi nointiti atima.', step4Title: 'Yoyo hoaya', step4Body: 'Tapu, beniaitai willati, nete benibokabobi yoyo.', step5Title: '¡Ixon hoayaai!', step5Body: 'Cuenta jakon. Benibo akllaai, jato!', next: 'Ixon', prev: 'Nete', finish: '¡Ixon!', skip: 'Phuqa' },
    audio: { listen: 'Nointi', stop: 'Sayati' },
  },
};

export function t(lang: Lang, section: keyof Translations, key: string): string {
  const s = translations[lang]?.[section] as Record<string, string> | undefined;
  return s?.[key] ?? (translations.es[section] as Record<string, string>)[key] ?? key;
}

export function getLang(): Lang {
  const stored = localStorage.getItem('ay_lang') as Lang;
  return stored && ['es','qu','ay','sh'].includes(stored) ? stored : 'es';
}

export function setLang(lang: Lang) {
  localStorage.setItem('ay_lang', lang);
}
