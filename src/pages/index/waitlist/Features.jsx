import { Container, Title, SimpleGrid, Card, Text } from '@mantine/core';
import { IconShare, IconVideo, IconDownload, IconZoom } from '@tabler/icons-react';

const Features = () => (
  <Container size="lg" py="xl">
    <Title order={2} ta="center" mb="xl">
      Características
    </Title>
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconShare size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Invita a cualquier usuario con un enlace
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Comparte el estudio por email, Slack o redes y deja que clientes y equipos graben cuando mejor les encaje, sin instalar nada
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconVideo size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Feedback en vídeo, pantalla y voz
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Observa cada clic, escucha sus dudas en tiempo real y entiende el por qué detrás del comportamiento
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconZoom size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Tareas guiadas y escenarios realistas
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Diseña recorridos con instrucciones claras para que los participantes reproduzcan situaciones reales de uso 
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconDownload size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Transcripción automática
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Revisa las grabaciones con texto sincronizado y comparte hallazgos con tu equipo.
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconDownload size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Insights clave
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Detecta temas recurrentes, momentos críticos y oportunidades de mejora a partir de las sesiones grabadas.
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconDownload size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Descarga, comparte y colabora
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Exporta vídeos y resúmenes, compártelos con stakeholders y alinea decisiones de diseño en un solo lugar.
        </Text>
      </Card>
    </SimpleGrid>
  </Container>
);

export default Features;