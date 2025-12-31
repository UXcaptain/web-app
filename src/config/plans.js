export const PLAN_FEATURES_CATALOG = [
  { key: 'quality_feedback', label: 'Feedback cualitativo de calidad en video y audio',},
  { key: 'own_participants_unlimited', label: 'Análisis ilimitados con tus propios participantes' },
  {
    key: 'included_participants_per_month',
    label: 'Participantes incluidos/mes',
    helpText:
      'Los que no utilices, se acumulan. Puedes comprar participantes adicionales bajo demanda.',
  },
  {
    key: 'transcription',
    label: 'Transcripción automática con IA',
    helpText:
      'Generación automática de transcripción para las grabaciones - Incluye marcas de tiempo.',
  },
  {
    key: 'ai_insights',
    label: 'Extracción de insights con IA',
    helpText:
      'Extracción de insights con IA automáticas para identificar patrones y aprendizajes clave en las sesiones.',
  },
  {
    key: 'demographic_segments',
    label: 'Segmentación demográfica de los participantes',
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
        'quality_feedback',
        'own_participants_unlimited',
        'support',
        'rgpd_eu_hosted',
      ],
      labelOverrides: {
        included_participants_per_month: 'Sin participantes incluidos',
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
        'quality_feedback',
        'own_participants_unlimited',
        'included_participants_per_month',
        'transcription',
        'support',
        'rgpd_eu_hosted',
      ],
      labelOverrides: {
        included_participants_per_month: '5 participantes incluidos/mes',
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
        'quality_feedback',
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
        support: 'Soporte prioritario - respuesta en menos de 8h',
      },
    }),
  },
};