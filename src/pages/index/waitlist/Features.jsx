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
          Reclutamiento sin fricción
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Comparte un enlace, sin descargas ni registros complejos
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconVideo size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Feedback directo, en video y voz
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Escucha el feedback directamente de los usuarios mientras observas cómo interactúan con tu producto
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconZoom size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Análisis guiados
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          ¡Tu decides! - Guía a los participantes hacia las áreas más críticas o que más te preocupen 
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconDownload size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Descarga y comparte
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Descarga los análisis y compártelos con quien y cómo quieras
        </Text>
      </Card>
    </SimpleGrid>
  </Container>
);

export default Features;