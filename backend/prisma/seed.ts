import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos iniciales...');

  // Usuarios demo
  const hashedPassword = await bcrypt.hash('Demo1234!', 10);
  await prisma.user.upsert({
    where: { dni: '12345678' },
    update: {},
    create: {
      dni: '12345678',
      name: 'María Quispe',
      password: hashedPassword,
      language: 'es',
      community: 'Puno',
      role: 'student',
      tutorialDone: false,
    },
  });

  await prisma.user.upsert({
    where: { dni: '87654321' },
    update: {},
    create: {
      dni: '87654321',
      name: 'Julián Mamani',
      password: await bcrypt.hash('Facil123!', 10),
      language: 'qu',
      community: 'Cusco',
      role: 'facilitator',
      tutorialDone: true,
    },
  });

  const courses = [
    {
      slug: 'ganaderia',
      title: 'Ganadería inteligente',
      description: 'Registra llamas y alpacas en tu celular: salud, vacunas, crías y peso.',
      category: 'vida-campo',
      difficulty: 'inicial',
      durationWeeks: 4,
      order: 1,
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      lessons: [
        { order: 1, title: 'Identificación de animales', description: 'Aprende a registrar tus llamas y alpacas con un código único en tu celular.', content: 'En esta lección aprenderás a crear fichas digitales para cada animal de tu rebaño. Usaremos una aplicación gratuita que funciona sin internet.' },
        { order: 2, title: 'Control de salud y vacunas', description: 'Mantén un calendario de vacunación y seguimiento de enfermedades.', content: 'Crear un calendario de vacunas es fácil con tu celular. Aprenderás a programar recordatorios y registrar cada tratamiento que le das a tus animales.' },
        { order: 3, title: 'Registro de peso y nutrición', description: 'Monitorea el crecimiento y la alimentación de tu ganado.', content: 'El peso de tus animales te dice mucho sobre su salud. Aprenderás a registrar pesos mensuales y calcular la cantidad correcta de alimento.' },
        { order: 4, title: 'Control de reproducción', description: 'Planifica las crías y lleva registro de partos.', content: 'La reproducción planificada aumenta la calidad de tu rebaño. Aprenderás a registrar fechas de cubrición, embarazos y partos.' },
        { order: 5, title: 'Producción de fibra', description: 'Registra la esquila y calcula el valor de tu fibra.', content: 'La fibra de alpaca es muy valiosa. Aprenderás a registrar la producción anual y calcular los ingresos que puedes obtener.' },
        { order: 6, title: 'Producción de leche', description: 'Controla la producción láctea de tus animales.', content: 'Si tienes vacas o cabras, esta lección te enseñará a registrar la producción diaria de leche y detectar cuando un animal produce menos de lo normal.' },
        { order: 7, title: 'Manejo de pastos', description: 'Organiza el uso de tus pastizales para que no se agoten.', content: 'Los pastos son el alimento de tus animales. Aprenderás a dividir tus pastizales en sectores y rotar el ganado para que siempre haya pasto fresco.' },
        { order: 8, title: 'Costos y precios', description: 'Calcula cuánto te cuesta criar y cuánto debes cobrar.', content: 'Para ganar dinero con tu ganado necesitas conocer tus costos. En esta lección aprenderás a registrar todos los gastos y calcular el precio justo de venta.' },
        { order: 9, title: 'Estrategias de venta', description: 'Aprende dónde y cómo vender tus animales al mejor precio.', content: 'Hay muchos lugares donde puedes vender tu ganado: ferias, mercados, compradores directos. Aprenderás a comparar precios y elegir la mejor opción.' },
        { order: 10, title: 'Comunicación con clientes', description: 'Usa WhatsApp y redes para contactar compradores.', content: 'WhatsApp Business te permite mostrar tus animales a compradores sin salir de tu comunidad. Aprenderás a crear un perfil profesional y responder consultas.' },
        { order: 11, title: 'Preparación para emergencias', description: 'Qué hacer en caso de enfermedades o desastres.', content: 'Las heladas, sequías y epidemias pueden afectar tu ganado. En esta lección aprenderás a preparar un plan de emergencia y proteger tu inversión.' },
        { order: 12, title: 'Mi plan ganadero', description: 'Crea tu plan personal de mejora del rebaño.', isPractical: true, content: 'Es hora de aplicar todo lo que aprendiste. Crearás un plan completo para mejorar tu rebaño en los próximos 6 meses, con metas claras y pasos concretos.' },
      ],
    },
    {
      slug: 'cultivo',
      title: 'Cultivo y riego automático',
      description: 'Sensores simples para regar tus cultivos sin desperdiciar agua.',
      category: 'vida-campo',
      difficulty: 'intermedio',
      durationWeeks: 6,
      order: 2,
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
      lessons: [
        { order: 1, title: 'Tipos de cultivos andinos', description: 'Conoce las plantas que mejor crecen en la sierra.', content: 'Papa, quinua, maíz, habas y otros cultivos andinos tienen características especiales. Aprenderás qué necesita cada planta para crecer sano.' },
        { order: 2, title: 'Preparación del suelo', description: 'Cómo preparar tu tierra para una buena cosecha.', content: 'Un suelo bien preparado es la base de una buena cosecha. Aprenderás técnicas tradicionales combinadas con herramientas modernas para mejorar tu tierra.' },
        { order: 3, title: 'Sistema de riego por goteo', description: 'Instala un riego eficiente con materiales baratos.', content: 'El riego por goteo usa 70% menos agua que el riego por inundación. Con mangueras y conectores simples puedes instalar tu propio sistema.' },
        { order: 4, title: 'Sensores de humedad', description: 'Aprende a usar sensores baratos para medir cuando regar.', content: 'Los sensores de humedad del suelo te avisan cuándo tus cultivos necesitan agua. Son baratos y fáciles de usar con tu celular.' },
        { order: 5, title: 'Aplicaciones de clima', description: 'Usa apps gratis para predecir lluvia y heladas.', content: 'Aplicaciones como Weather Underground y SENAMHI te dan información del clima de tu zona. Aprenderás a usarlas para planificar riegos y proteger cultivos.' },
        { order: 6, title: 'Control de plagas digital', description: 'Identifica y trata plagas con ayuda de apps.', content: 'Existen apps que identifican plagas y enfermedades con solo tomar una foto de la planta. Aprenderás a usarlas y encontrar tratamientos naturales.' },
        { order: 7, title: 'Rotación de cultivos', description: 'Planifica qué plantar cada temporada para no agotar la tierra.', content: 'Rotar cultivos mantiene el suelo fértil y reduce plagas. Aprenderás a crear un calendario de siembra para los próximos dos años.' },
        { order: 8, title: 'Cosecha y post-cosecha', description: 'Cómo cosechar y conservar tus productos correctamente.', content: 'Una mala cosecha puede arruinar meses de trabajo. Aprenderás el momento correcto para cosechar y cómo conservar tus productos para venderlos mejor.' },
        { order: 9, title: 'Mi plan de cultivo', description: 'Diseña tu calendario agrícola del año.', isPractical: true, content: 'Aplicarás todo lo aprendido para crear un plan completo de cultivo para tu parcela, con calendario de siembra, riego y cosecha.' },
      ],
    },
    {
      slug: 'clima',
      title: 'Lectura del clima andino',
      description: 'Apps gratuitas para predecir lluvia y heladas en tu zona.',
      category: 'vida-campo',
      difficulty: 'inicial',
      durationWeeks: 2,
      order: 3,
      imageUrl: 'https://images.unsplash.com/photo-1504608524841-42584120d093?w=400',
      lessons: [
        { order: 1, title: 'El clima en la sierra', description: 'Entiende los patrones de clima de los Andes.', content: 'El clima andino es muy variable. En esta lección aprenderás sobre las temporadas de lluvia, heladas y vientos que afectan tus cultivos y animales.' },
        { order: 2, title: 'Apps meteorológicas gratuitas', description: 'Descarga y configura las mejores apps de clima.', content: 'Te mostraremos las mejores aplicaciones gratuitas de clima que funcionan en zonas rurales con poca señal: Windy, SENAMHI, Weather Underground.' },
        { order: 3, title: 'Predicción de heladas', description: 'Cómo anticiparte a las heladas para proteger tus cultivos.', content: 'Las heladas pueden destruir toda tu cosecha en una noche. Aprenderás a usar apps para predecir heladas con 48 horas de anticipación y proteger tus plantas.' },
        { order: 4, title: 'Mi estación meteorológica', description: 'Crea una estación casera para medir el clima de tu comunidad.', isPractical: true, content: 'Con materiales simples construirás una pequeña estación para medir temperatura, lluvia y viento, y registrarás los datos en tu celular.' },
      ],
    },
    {
      slug: 'tierras',
      title: 'Alquiler de tierras digital',
      description: 'Publica tus parcelas y gestiona pagos seguros desde tu celular.',
      category: 'negocio-dinero',
      difficulty: 'inicial',
      durationWeeks: 3,
      order: 4,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      lessons: [
        { order: 1, title: 'Documentos de tu tierra', description: 'Organiza los papeles de tu parcela en tu celular.', content: 'Tener tus documentos digitalizados es muy importante. Aprenderás a fotografiar y guardar de forma segura tus títulos de propiedad y otros documentos.' },
        { order: 2, title: 'Cómo publicar tu parcela', description: 'Crea un anuncio atractivo en plataformas online.', content: 'Con buenas fotos y una descripción clara puedes alquilar tu tierra a buen precio. Aprenderás a publicar en OLX, Facebook Marketplace y grupos de WhatsApp.' },
        { order: 3, title: 'Contrato digital simple', description: 'Redacta un contrato básico que proteja tus derechos.', content: 'Un contrato simple pero claro te protege de problemas. Usaremos una plantilla que puedes completar en tu celular y firmar digitalmente.' },
        { order: 4, title: 'Pagos seguros por celular', description: 'Recibe pagos con Yape, Plin u otros medios digitales.', content: 'Recibir dinero por celular es rápido y seguro. Aprenderás a usar Yape, Plin y transferencias bancarias para cobrar el alquiler de tu tierra.' },
        { order: 5, title: 'Mi primer alquiler digital', description: 'Publica tu parcela y busca un arrendatario.', isPractical: true, content: 'Pondrás en práctica todo lo aprendido: crearás el anuncio de tu parcela, el contrato y configurarás tu método de cobro.' },
      ],
    },
    {
      slug: 'textiles',
      title: 'Venta de textiles por internet',
      description: 'Fotografía y vende tus tejidos en línea con envíos a todo el Perú.',
      category: 'negocio-dinero',
      difficulty: 'inicial',
      durationWeeks: 4,
      order: 5,
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400',
      lessons: [
        { order: 1, title: 'Fotografía de artesanías', description: 'Aprende a tomar fotos profesionales con tu celular.', content: 'Una buena foto vende sola. Aprenderás técnicas simples de fotografía para mostrar los colores y detalles de tus tejidos de la mejor manera.' },
        { order: 2, title: 'Facebook e Instagram para vender', description: 'Crea páginas de negocio y publica tus productos.', content: 'Facebook e Instagram son los mejores lugares para vender artesanías. Aprenderás a crear una página de negocio y publicar tus tejidos con descripciones atractivas.' },
        { order: 3, title: 'Precios justos para tus tejidos', description: 'Calcula el precio correcto considerando tu trabajo.', content: 'Muchos artesanos venden muy barato y pierden dinero. Aprenderás a calcular el precio real de cada tejido considerando materiales, tiempo y ganancia justa.' },
        { order: 4, title: 'Envíos a todo el Perú', description: 'Usa Olva Courier y Shalom para enviar tus productos.', content: 'Enviar tus tejidos por courier es fácil y económico. Aprenderás a usar Olva Courier y Shalom, empaquetar correctamente y rastrear tus envíos.' },
        { order: 5, title: 'Atención al cliente por WhatsApp', description: 'Responde consultas y coordina ventas por mensaje.', content: 'WhatsApp Business te permite tener un negocio profesional desde tu celular. Configurarás respuestas automáticas y catálogos de productos.' },
        { order: 6, title: 'Mi tienda virtual', description: 'Crea y publica tu primera tienda online.', isPractical: true, content: 'Crearás tu página de negocio completa con fotos, precios y métodos de pago. Tu tienda quedará lista para recibir pedidos.' },
      ],
    },
    {
      slug: 'cuentas',
      title: 'Cuentas claras de la chacra',
      description: 'Contabilidad móvil con plantillas simples para tu negocio agrícola.',
      category: 'negocio-dinero',
      difficulty: 'inicial',
      durationWeeks: 3,
      order: 6,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      lessons: [
        { order: 1, title: 'Ingresos y gastos básicos', description: 'Aprende a registrar todo el dinero que entra y sale.', content: 'Saber cuánto ganas y cuánto gastas es fundamental para tu negocio. Aprenderás a usar una aplicación gratuita para registrar cada sol que entra y sale.' },
        { order: 2, title: 'Plantillas para la chacra', description: 'Usa hojas de cálculo simples en tu celular.', content: 'Google Sheets funciona en tu celular y es gratis. Te daremos plantillas listas para llevar las cuentas de tus cultivos, animales y ventas.' },
        { order: 3, title: 'Cuánto gano realmente', description: 'Calcula tu ganancia real al final de cada temporada.', content: 'Muchos agricultores trabajan mucho pero no saben si ganaron o perdieron. Aprenderás a calcular tu ganancia real descontando todos los costos.' },
        { order: 4, title: 'Ahorro y crédito responsable', description: 'Cómo ahorrar y cuándo pedir préstamos.', content: 'El ahorro te protege en malos tiempos. Aprenderás estrategias de ahorro para agricultores y cómo evaluar si un crédito te conviene.' },
        { order: 5, title: 'Mi balance de la temporada', description: 'Analiza los resultados de tu chacra.', isPractical: true, content: 'Usarás la plantilla para analizar los resultados de la última temporada y planificar la siguiente con metas de ahorro e inversión.' },
      ],
    },
    {
      slug: 'computadora',
      title: 'Primeros pasos con la computadora',
      description: 'Aprende a usar computadoras y estar seguro en internet.',
      category: 'primeros-pasos',
      difficulty: 'inicial',
      durationWeeks: 4,
      order: 7,
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
      lessons: [
        { order: 1, title: 'Partes de la computadora', description: 'Conoce el teclado, el ratón y la pantalla.', content: 'La computadora tiene partes que se tocan (hardware) y partes que no se tocan (software). En esta lección conocerás cada parte y para qué sirve.' },
        { order: 2, title: 'Cómo encender y apagar', description: 'Los primeros pasos para usar una computadora.', content: 'Encender, apagar y reiniciar la computadora correctamente evita problemas. Aprenderás también a crear tu propio usuario con contraseña.' },
        { order: 3, title: 'El teclado y el ratón', description: 'Práctica con las herramientas básicas.', content: 'El teclado y el ratón son tus herramientas principales. Con ejercicios prácticos aprenderás a escribir y usar el ratón con confianza.' },
        { order: 4, title: 'Navegar en internet', description: 'Busca información y visita sitios web seguros.', content: 'Internet tiene muchísima información útil para ti. Aprenderás a usar Google, encontrar información confiable y reconocer sitios peligrosos.' },
        { order: 5, title: 'Correo electrónico', description: 'Crea y usa tu primera cuenta de email.', content: 'El correo electrónico es esencial para comunicarse y acceder a servicios digitales. Crearás tu cuenta de Gmail y aprenderás a enviar y recibir mensajes.' },
        { order: 6, title: 'Seguridad en internet', description: 'Protégete de estafas y mantén tus datos seguros.', content: 'En internet hay personas que quieren robarte dinero o información. Aprenderás a reconocer estafas, crear contraseñas seguras y proteger tus datos.' },
        { order: 7, title: 'Mi práctica digital', description: 'Realiza tareas básicas en computadora.', isPractical: true, content: 'Realizarás tareas reales: buscar información sobre precios de mercado, enviar un email y descargar una aplicación útil para tu trabajo.' },
      ],
    },
    {
      slug: 'solar',
      title: 'Energía solar para la casa',
      description: 'Instala pequeños paneles solares para iluminación y carga de celulares.',
      category: 'energia-recursos',
      difficulty: 'intermedio',
      durationWeeks: 5,
      order: 8,
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
      lessons: [
        { order: 1, title: 'Cómo funciona la energía solar', description: 'Entiende de dónde viene la energía del sol.', content: 'La energía solar transforma la luz del sol en electricidad. Aprenderás los principios básicos y por qué es perfecta para comunidades rurales andinas.' },
        { order: 2, title: 'Tipos de paneles solares', description: 'Conoce los diferentes paneles y cuál elegir.', content: 'Hay paneles de diferentes tamaños y precios. Te mostraremos cuáles son los mejores para uso doméstico y cuántos necesitas según tu consumo.' },
        { order: 3, title: 'Cálculo de consumo eléctrico', description: 'Calcula cuánta energía necesitas.', content: 'Antes de comprar paneles debes saber cuánta energía consumes. Aprenderás a hacer el cálculo con una fórmula simple considerando focos, celulares y radio.' },
        { order: 4, title: 'Instalación básica', description: 'Pasos para instalar un kit solar pequeño.', content: 'Un kit solar básico es fácil de instalar. Aprenderás los pasos de seguridad, cómo orientar el panel y conectar la batería y los focos.' },
        { order: 5, title: 'Mantenimiento del sistema', description: 'Cómo cuidar tus paneles para que duren más.', content: 'Con buen mantenimiento tus paneles duran 25 años. Aprenderás a limpiarlos, verificar las conexiones y detectar problemas comunes.' },
        { order: 6, title: 'Financiamiento y subsidios', description: 'Cómo conseguir apoyo económico para instalar paneles.', content: 'El Estado peruano tiene programas de subsidio para energía solar rural. Aprenderás cuáles son y cómo postular.' },
        { order: 7, title: 'Mi proyecto solar', description: 'Diseña el sistema solar para tu hogar.', isPractical: true, content: 'Calcularás el sistema solar perfecto para tu hogar: cuántos paneles, qué batería y qué presupuesto necesitas.' },
      ],
    },
  ];

  for (const courseData of courses) {
    const { lessons, ...courseInfo } = courseData;
    const course = await prisma.course.upsert({
      where: { slug: courseInfo.slug },
      update: {},
      create: courseInfo,
    });

    for (const lesson of lessons) {
      const existing = await prisma.lesson.findFirst({ where: { courseId: course.id, order: lesson.order } });
      await prisma.lesson.upsert({
        where: { id: existing?.id ?? 0 },
        update: {},
        create: { ...lesson, courseId: course.id, isPractical: lesson.isPractical ?? false },
      });
    }
    console.log(`✅ Curso: ${courseInfo.title}`);
  }

  const ganaderia = await prisma.course.findUnique({ where: { slug: 'ganaderia' } });
  const demo = await prisma.user.findUnique({ where: { dni: '12345678' } });
  if (ganaderia && demo) {
    const exists = await prisma.forumPost.findFirst({ where: { userId: demo.id, courseId: ganaderia.id } });
    if (!exists) {
      await prisma.forumPost.create({
        data: { userId: demo.id, courseId: ganaderia.id, title: '¿Cómo registro vacunas sin internet?', body: 'Hola compañeros, vivo en una zona sin señal. ¿La app funciona sin conexión?' },
      });
    }
  }

  console.log('\n✅ Base de datos lista');
  console.log('Usuario demo: DNI 12345678 / Demo1234!');
  console.log('Facilitador:  DNI 87654321 / Facil123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
