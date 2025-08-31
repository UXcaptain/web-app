import { Container, Title, SimpleGrid, Card, Stack, Text } from '@mantine/core';
import { IconClipboardList, IconShare, IconRecordMail } from '@tabler/icons-react';

const WaitlistHowItWorks = () => (
  <Container size="lg" py="xl" id="como-funciona">
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
          <Text fw={700} fz="lg">1. Crea un estudio</Text>
          <Text c="dimmed" ta="center">
            Define objetivos y tareas en minutos con nuestras plantillas.
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
          <IconShare size={56} color="#238BE6" />
        </Card.Section>
        <Stack gap="xs" align="center" mt="md">
          <Text fw={700} fz="lg">2. Recluta participantes</Text>
          <Text c="dimmed" ta="center">
            Comparte un enlace y recluta donde ya están tus usuarios.
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
          <IconRecordMail size={56} color="#238BE6" />
        </Card.Section>
        <Stack gap="xs" align="center" mt="md">
          <Text fw={700} fz="lg">3. Comparte insights</Text>
          <Text c="dimmed" ta="center">
            Acelera el análisis y comparte hallazgos con tu equipo.
          </Text>
        </Stack>
      </Card>
    </SimpleGrid>
  </Container>
);

export default WaitlistHowItWorks;