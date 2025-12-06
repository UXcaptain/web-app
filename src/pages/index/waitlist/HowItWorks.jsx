import { Container, Title, SimpleGrid, Card, Stack, Text } from '@mantine/core';
import { IconClipboardList, IconShare, IconRecordMail, IconTrendingUp , IconUser } from '@tabler/icons-react';

const HowItWorks = () => (
  <Container size="lg" py="xl" id="how-it-works">
    <Title order={2} ta="center" mb="xl">
      Cómo funciona
    </Title>

    <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} spacing="xl">
      <Card shadow="sm" radius="lg" withBorder p="lg">
        <Card.Section
          p="xl"
          bg="gray.0"
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
        >
          <IconClipboardList size={56} color="#238BE6" />
        </Card.Section>
        <Stack gap="xs" align="center" mt="md">
          <Text fw={700} fz="lg">1. Comparte un enlace con quien quieras</Text>
          <Text c="dimmed" ta="center">
            Invita a clientes, leads o miembros de tu equipo con un simple enlace, sin instalaciones ni configuración técnica.
          </Text>
        </Stack>
      </Card>

      <Card shadow="sm" radius="lg" withBorder p="lg">
        <Card.Section
          p="xl"
          bg="gray.0"
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
        >
          <IconUser size={56} color="#238BE6" />
        </Card.Section>
        <Stack gap="xs" align="center" mt="md">
          <Text fw={700} fz="lg">2. Ellos graban su pantalla y su voz</Text>
          <Text c="dimmed" ta="center">
            Los participantes usan tu producto mientras se graba su navegación, sus comentarios en voz alta y el contexto de cada tarea.
          </Text>
        </Stack>
      </Card>

      <Card shadow="sm" radius="lg" withBorder p="lg">
        <Card.Section
          p="xl"
          bg="gray.0"
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
        >
          <IconTrendingUp size={56} color="#238BE6" />
        </Card.Section>
        <Stack gap="xs" align="center" mt="md">
          <Text fw={700} fz="lg">3. Revisa los vídeos, detecta bloqueos y mejoras potenciales</Text>
          <Text c="dimmed" ta="center">
            Explora las sesiones, identifica puntos de fricción y genera ideas de mejora accionables para tu equipo de producto.
          </Text>
        </Stack>
      </Card>
    </SimpleGrid>
  </Container>
);

export default HowItWorks;