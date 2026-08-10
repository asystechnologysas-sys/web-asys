export const projectsData = [
  {
    id: 'inventario-tienda-luzmila',
    title: 'Sistema de Control de Inventarios & Registro de Ventas para Tienda de Barrio',
    category: 'inventarios',
    categoryLabel: 'Software POS & Inventarios',
    client: 'Sra. Luzmila (Propietaria de Tienda de Barrio)',
    testimonialName: 'Sra. Luzmila',
    testimonialRole: 'Propietaria de Tienda de Barrio',
    testimonialQuote: 'Antes todo lo anotaba en cuadernos de papel y no sabía qué productos se vencían ni cuánto dinero entraba por Nequi. Ahora registro mis ventas en segundos, controlo las cuentas por cobrar y sé exactamente qué comprar.',
    impactMetrics: {
      efficiency: '+92%',
      timeSaved: '3.5 hrs/día',
      accuracy: '100%',
      roi: 'Control Total de Caja'
    },
    shortDescription: 'Software ágil de punto de venta (POS) e inventario para tiendas de barrio. Registro de ventas con Nequi, fiados, productos menos vendidos y estadísticas financieras.',
    fullDescription: 'Desarrollo de una solución tecnológica accesible diseñada para la tienda de barrio de la Sra. Luzmila. La plataforma permite registrar ventas rápidamente seleccionando múltiples medios de pago (Efectivo, Nequi, Daviplata, Fiado local), controlar el stock de inventario de todos los productos en tiempo real, visualizar gráficas automáticas de ventas diarias y detectar los productos de menor rotación para evitar pérdidas.',
    technologies: ['React Web POS', 'Chart.js Estadísticas', 'Integración Nequi / Daviplata', 'Base de Datos Local & Cloud'],
    images: [
      { url: '/assets/tienda_demo1.svg', caption: 'Panel Principal de Punto de Venta (POS) y Métodos de Pago Nequi / Efectivo' }
    ],
    featuresList: [
      'Registro de ventas en pantalla táctil o teclado con múltiples formas de pago (Nequi, Daviplata, Efectivo).',
      'Control y actualización automática del inventario de todos los productos de la tienda.',
      'Gráficas interactiva de ventas diarias, semanales y margen de ganancia.',
      'Reporte inteligente de productos menos vendidos para optimizar compras a proveedores.',
      'Gestión de libreta de clientes del barrio y control de saldos fiados.'
    ],
    workflowSteps: [
      '1. Selección rápida del producto en el catálogo o escaneo.',
      '2. Elección del método de pago elegido por el cliente (Efectivo, Nequi, Daviplata o Fiado).',
      '3. Descuento automático en tiempo real del inventario.',
      '4. Actualización del tablero analítico de ventas y alertas de stock bajo.'
    ],
    beforeVsAfter: {
      before: 'Anotaciones manuales en cuadernos, descuadres frecuentes al final del día y descontrol en cobros por Nequi y cuentas fiadas.',
      after: 'Control digital instantáneo de inventario y dinero en caja, 0 pérdidas por productos vencidos y registro transparente de todos los métodos de pago.'
    },
    imageBg: 'linear-gradient(135deg, #0b1a3a 0%, #1b56ca 100%)'
  },

  {
    id: 'agendamiento-barberia-jorge',
    title: 'Sistema de Agendamiento de Citas Automatizado para Barbería',
    category: 'servicios',
    categoryLabel: 'Barberías & Servicios',
    client: 'Jorge Mendoza (Barbero Profesional)',
    testimonialName: 'Jorge Mendoza',
    testimonialRole: 'Barbero Profesional & Propietario',
    testimonialQuote: 'Perdía clientes y tiempo precioso respondiendo chats de WhatsApp a mitad de un corte. Ahora mis clientes agendan su cita solos en segundos y el sistema les envía recordatorios automáticos.',
    impactMetrics: {
      efficiency: '+96%',
      timeSaved: '15 hrs/semana',
      accuracy: '0 Citas Traslapadas',
      roi: '+40% Citas Cumplidas'
    },
    shortDescription: 'Plataforma web de reserva de citas 24/7 para la barbería de Jorge Mendoza. Eliminación de cuadernos de papel, selección de servicios y recordatorios por WhatsApp.',
    fullDescription: 'Solución web a medida creada para resolver el caos del agendamiento manual en la barbería de barrio de Jorge Mendoza. El sistema permite a los clientes ingresar desde su celular, elegir el barbero (Jorge Mendoza o su equipo), seleccionar el servicio (corte urbano, arreglo de barba, pigmentación, combos), escoger la hora disponible y recibir confirmaciones y alertas por WhatsApp.',
    technologies: ['Web PWA Móvil', 'API WhatsApp Cloud', 'Calendario Dinámico', 'Panel de Administración'],
    images: [
      { url: '/assets/barberia_demo1.svg', caption: 'Pantalla de Selección de Servicios y Horarios para la Barbería de Jorge Mendoza' }
    ],
    featuresList: [
      'Reserva de citas 24/7 sin intervención manual ni interrupción al barbero.',
      'Catálogo visual de servicios con precios y tiempos de atención configurables.',
      'Bloqueo automático de franjas horarias ocupadas para evitar cruces de agenda.',
      'Recordatorio automático vía WhatsApp enviado al cliente horas antes de su turno.',
      'Panel de control ejecutivo para Jorge Mendoza con historial de clientes e ingresos.'
    ],
    workflowSteps: [
      '1. El cliente ingresa a la web desde su celular o WhatsApp.',
      '2. Selecciona el servicio deseado y al barbero Jorge Mendoza.',
      '3. Elige un horario disponible en el calendario interactivo.',
      '4. Recibe confirmación inmediata y recordatorio automático en su WhatsApp.'
    ],
    beforeVsAfter: {
      before: 'Pérdida de clientes por falta de respuesta rápida en WhatsApp, libretas manchadas y cruces accidentales de turnos.',
      after: 'Agenda 100% organizada en línea, clientes satisfechos con reserva inmediata y cero llamadas o chats durante los cortes.'
    },
    imageBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
  },

  {
    id: 'chatbot-ia-unimagdalena',
    title: 'Chatbot con IA y PLN para Estudiantes de Ingeniería de Sistemas (Tesis)',
    category: 'ia',
    categoryLabel: 'Inteligencia Artificial & Educación',
    client: 'Universidad del Magdalena (Tesis de Grado)',
    testimonialName: 'José Narváez',
    testimonialRole: 'Estudiante de Ing. de Sistemas - Universidad del Magdalena',
    testimonialQuote: 'Como proyecto de tesis en la Universidad del Magdalena, desarrollamos este chatbot inteligente con Procesamiento de Lenguaje Natural. Fue gratificante ver cómo resolvió de forma inmediata miles de dudas académicas de nuestros compañeros.',
    impactMetrics: {
      efficiency: '+98%',
      timeSaved: 'Respuesta < 2 seg',
      accuracy: '97.8% Precisión',
      roi: 'Tesis de Grado Aprobada'
    },
    shortDescription: 'Asistente virtual de investigación académica desarrollado con Procesamiento del Lenguaje Natural (PLN) para la carrera de Ingeniería de Sistemas de la Universidad del Magdalena.',
    fullDescription: 'Proyecto académico y técnico desarrollado por José Narváez para la Universidad del Magdalena. El sistema implementa modelos de Procesamiento de Lenguaje Natural (PLN/NLP) entrenados con la normativa, pensum, electivas, prerequisitos y horarios de tutorías del programa de Ingeniería de Sistemas. Atiende preguntas de los estudiantes en lenguaje informal, entregando respuestas inmediatas y guiadas.',
    technologies: ['Python / NLP / NLTK', 'Transformers & Machine Learning', 'Universidad del Magdalena Badge', 'FastAPI REST Server'],
    images: [
      { url: '/assets/unimagdalena_demo1.svg', caption: 'Interfaz del Chatbot IA con Marca Oficial Universidad del Magdalena' }
    ],
    featuresList: [
      'Comprensión avanzada de lenguaje natural para consultas informales de estudiantes.',
      'Consultas en tiempo real sobre pensum académico de Ingeniería de Sistemas.',
      'Información sobre prerrequisitos, créditos requeridos y asignación de tutorías.',
      'Incorporación de la identidad visual de la Universidad del Magdalena.',
      'Módulo de métricas para evaluar las dudas más frecuentes de los estudiantes.'
    ],
    workflowSteps: [
      '1. El estudiante redacta su consulta sobre materias o trámites.',
      '2. El motor de PLN analiza la intención lingüística y extrae las palabras clave.',
      '3. Consulta en la base de conocimiento estructurada de Ingeniería de Sistemas.',
      '4. Generación de respuesta inmediata con información contextual y requisitos.'
    ],
    beforeVsAfter: {
      before: 'Filas presenciales en secretaría académica y desinformación sobre prerrequisitos de materias.',
      after: 'Atención inmediata 24/7 desde cualquier dispositivo con respuestas exactas basadas en el reglamento oficial.'
    },
    imageBg: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
  }
];
