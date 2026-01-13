// Analysis templates with predefined questions for different use cases

export const analysisTemplates = {
  saasOnboarding: {
    id: 'saasOnboarding',
    name: 'SaaS Onboarding',
    description: 'Flujos de registro y configuración inicial para aplicaciones SaaS',
    tasks: [
      'Completa el proceso de registro en la plataforma',
      'Configura tu perfil o cuenta por primera vez',
      'Explora el tutorial o guía de bienvenida si está disponible',
      'Realiza tu primera acción o tarea en la plataforma',
      'Evalúa qué tan claro fue el proceso de onboarding'
    ]
  },
  landingPage: {
    id: 'landingPage',
    name: 'Landing Page',
    description: 'Efectividad del mensaje y llamadas a la acción',
    tasks: [
      '¿Qué entiendes que ofrece esta página en los primeros 5 segundos?',
      'Encuentra información sobre precios o planes',
      'Localiza la propuesta de valor principal del producto',
      'Identifica la llamada a la acción (CTA) principal',
      'Evalúa si el mensaje te motiva a tomar acción'
    ]
  },
  prototypeValidation: {
    id: 'prototypeValidation',
    name: 'Validación de Prototipo',
    description: 'Validación de nuevas iteraciones de UI/UX',
    tasks: [
      'Navega por el flujo principal del prototipo',
      'Intenta completar la tarea principal que propone el diseño',
      'Identifica elementos que te resulten confusos o poco claros',
      'Proporciona feedback sobre la experiencia visual',
      'Sugiere mejoras o cambios que consideres necesarios'
    ]
  },
  featureWorkflows: {
    id: 'featureWorkflows',
    name: 'Flujos de Funcionalidades',
    description: 'Prueba de herramientas y funcionalidades principales',
    tasks: [
      'Localiza y accede a la funcionalidad principal de la herramienta',
      'Completa una tarea usando esta funcionalidad',
      'Intenta compartir o exportar el resultado de tu trabajo',
      'Busca opciones de personalización o configuración',
      'Evalúa la facilidad de uso de esta funcionalidad'
    ]
  },
  accessibility: {
    id: 'accessibility',
    name: 'Accesibilidad',
    description: 'Pruebas de diseño inclusivo y accesibilidad',
    tasks: [
      'Navega por el sitio usando solo el teclado (Tab, Enter, flechas)',
      'Evalúa el contraste de colores y la legibilidad del texto',
      'Verifica que las imágenes tengan descripciones alternativas',
      'Prueba la navegación con un lector de pantalla si es posible',
      'Identifica barreras de accesibilidad que encuentres'
    ]
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'eCommerce',
    description: 'Análisis de tiendas online y procesos de compra',
    tasks: [
      'Navega por la página principal y encuentra un producto que te interese',
      'Añade el producto al carrito de compra',
      'Revisa el carrito y procede al checkout',
      'Completa el proceso de pago (sin realizar el pago real)',
      'Busca información sobre políticas de devolución y envío'
    ]
  },
  mobile: {
    id: 'mobile',
    name: 'App Móvil',
    description: 'Análisis de aplicaciones móviles',
    tasks: [
      'Completa el proceso de onboarding',
      'Explora las funcionalidades principales de la app',
      'Intenta personalizar tu perfil o configuración',
      'Realiza una acción principal de la aplicación',
      'Busca la sección de ayuda o soporte'
    ]
  },
  content: {
    id: 'content',
    name: 'Contenido/Blog',
    description: 'Análisis de sitios de contenido',
    tasks: [
      'Encuentra un artículo que te interese en la página principal',
      'Lee el artículo y evalúa su legibilidad',
      'Intenta buscar contenido sobre un tema específico',
      'Explora otras secciones o categorías del sitio',
      'Intenta suscribirte al newsletter o seguir en redes sociales'
    ]
  },
  booking: {
    id: 'booking',
    name: 'Reservas/Booking',
    description: 'Análisis de sistemas de reservas',
    tasks: [
      'Busca disponibilidad para una fecha específica',
      'Selecciona una opción que te interese',
      'Revisa los detalles y condiciones de la reserva',
      'Intenta modificar los parámetros de búsqueda',
      'Completa el proceso de reserva (sin confirmar el pago)'
    ]
  }
};

// Helper function to get template by id
export const getTemplateById = (id) => {
  return analysisTemplates[id] || null;
};

// Helper function to get all template options for dropdown
export const getTemplateOptions = () => {
  return Object.values(analysisTemplates).map(template => ({
    value: template.id,
    label: template.name,
    description: template.description
  }));
};

export default analysisTemplates;
