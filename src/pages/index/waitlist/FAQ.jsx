import { Container, Title, Accordion, Group, Anchor } from '@mantine/core';
import { IconHelpHexagon } from '@tabler/icons-react';

const WaitlistFAQ = () => (
  <Container size="lg" py="xl">
    <Title order={2} ta="center" mb="xl">
      Preguntas frecuentes
    </Title>
    <Accordion variant="separated">
      <Accordion.Item value="installation">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Necesito instalar algo?
        </Accordion.Control>
        <Accordion.Panel>
          No. Todo funciona en el navegador.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="privacy">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cómo protegéis los datos?
        </Accordion.Control>
        <Accordion.Panel>
          Controles de permisos, cifrado en tránsito y borrado bajo demanda.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="team">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Puedo invitar a mi equipo?
        </Accordion.Control>
        <Accordion.Panel>
          Sí. Podéis revisar sesiones, marcar hallazgos y compartir resúmenes.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="browsers">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Qué navegadores soportáis?
        </Accordion.Control>
        <Accordion.Panel>
          Últimas versiones de Chrome, Edge y Safari.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="availability">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cuándo estará disponible?
        </Accordion.Control>
        <Accordion.Panel>
          Empezaremos con acceso temprano por lotes. Únete a la lista para priorizar tu acceso.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>

    <Group justify="center" mt="xl">
      <Anchor href="/preguntas-frecuentes" size="sm">
        Ver todas las preguntas
      </Anchor>
    </Group>
  </Container>
);

export default WaitlistFAQ;