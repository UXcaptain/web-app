import { Container, Title, SimpleGrid, Card, Text } from '@mantine/core';
import { IconShare, IconVideo, IconChartBar, IconShieldLock } from '@tabler/icons-react';

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
          Grabaciones ricas
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Audio, cámara y pantalla en una sola sesión
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconChartBar size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Análisis asistido
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Marcadores y resúmenes para encontrar patrones más rápido
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="lg" bg="gray.0">
          <IconShieldLock size={48} color="#238BE6" />
        </Card.Section>
        <Text fw={500} mt="md">
          Privacidad y seguridad
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Control de permisos y borrado bajo demanda
        </Text>
      </Card>
    </SimpleGrid>
  </Container>
);

export default Features;