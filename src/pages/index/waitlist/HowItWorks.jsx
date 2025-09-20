import { Container, Title, SimpleGrid, Card, Stack, Text } from '@mantine/core';
import { IconClipboardList, IconShare, IconRecordMail, IconTrendingUp , IconUser } from '@tabler/icons-react';

const WaitlistHowItWorks = () => (
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
          <Text fw={700} fz="lg">1. Crea tu análisis</Text>
          <Text c="dimmed" ta="center">
            Decide qué quieres analizar y crea tu análisis en menos de 5 minutos.
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
          <Text fw={700} fz="lg">2. Recluta participantes</Text>
          <Text c="dimmed" ta="center">
            Comparte un enlace con tus clientes, en redes sociales, o incluso tu equipo interno.
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
          <Text fw={700} fz="lg">3. Mejora tus productos</Text>
          <Text c="dimmed" ta="center">
            Extrae insights, identifica pain points y mejora tus productos gracias al feedback claro y directo de usuarios reales.
          </Text>
        </Stack>
      </Card>
    </SimpleGrid>
  </Container>
);

export default WaitlistHowItWorks;