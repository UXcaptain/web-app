export const PLAN_FEATURES_CATALOG = [
  { key: 'own_participants_unlimited', label: 'Análisis ilimitados con tus propios participantes' },
  {
    key: 'included_participants_per_month',
    label: 'Participantes incluidos/mes',
    helpText:
      'Participantes incluidos en tu suscripción cada mes. Puedes comprar participantes adicionales bajo demanda.',
  },
  {
    key: 'transcription',
    label: 'Transcripción',
    helpText:
      'Generación automática de transcripción para las grabaciones, según las capacidades del plan.',
  },
  {
    key: 'ai_insights',
    label: 'Extracción de insights con IA',
    helpText:
      'Sugerencias automáticas para identificar patrones y aprendizajes clave en las sesiones.',
  },
  {
    key: 'demographic_segments',
    label: 'Segmentos demográficos de participantes',
    helpText:
      'Permite filtrar/segmentar a los participantes (p. ej., edad, país, rol) para estudios más específicos.',
  },
  {
    key: 'support',
    label: 'Soporte',
    helpText: 'Tiempo de respuesta estimado del equipo de soporte.',
  },
  { key: 'rgpd_eu_hosted', label: 'RGPD - Alojado en la UE' },
];

const buildPlanFeatures = ({ includedKeys, labelOverrides = {} }) =>
  PLAN_FEATURES_CATALOG.map((feature) => ({
    key: feature.key,
    label: labelOverrides[feature.key] ?? feature.label,
    included: includedKeys.includes(feature.key),
    helpText: feature.helpText,
  }));

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Básico',
    price: 0,
    currency: '€',
    period: 'mes',
    subtitle: 'Para individuos que están comenzando.',
    features: buildPlanFeatures({
      includedKeys: [
        'own_participants_unlimited',

        'support',
        'rgpd_eu_hosted',
      ],
      labelOverrides: {
        included_participants_per_month: 'Sin participantes incluidos',
        transcription: 'Transcripción básica con marcas de tiempo con IA',
        support: 'Soporte básico - respuesta en menos de 48h',
      },
    }),
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    currency: '€',
    period: 'mes',
    subtitle: 'Para equipos pequeños que necesitan transcripción de IA y soporte prioritario.',
    features: buildPlanFeatures({
      includedKeys: [
        'own_participants_unlimited',
        'included_participants_per_month',
        'transcription',
        'support',
        'rgpd_eu_hosted',
      ],
      labelOverrides: {
        included_participants_per_month: '5 participantes incluidos/mes',
        transcription: 'Transcripción con marcas de tiempo con IA',
        support: 'Soporte prioritario - respuesta en menos de 24h',
      },
    }),
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: '€',
    period: 'mes',
    subtitle: 'Para equipos que necesitan segmentación y soporte más rápido.',
    features: buildPlanFeatures({
      includedKeys: [
        'own_participants_unlimited',
        'included_participants_per_month',
        'transcription',
        'ai_insights',
        'demographic_segments',
        'support',
        'rgpd_eu_hosted',
      ],
      labelOverrides: {
        included_participants_per_month: '10 participantes incluidos/mes',
        transcription: 'Transcripción por entrada de análisis con IA',
        support: 'Soporte prioritario - respuesta en menos de 8h',
      },
    }),
  },
};