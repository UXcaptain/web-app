import { Container, Stack, Title, Text, Group, Button } from '@mantine/core';
import { IconUserPlus, IconBulb } from '@tabler/icons-react';

const WaitlistHero = () => (
  <Container size="lg" py="xl">
    <Stack align="center" gap="xl">
      <Title order={1} ta="center">
        Investiga con usuarios reales, en minutos
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        Reúne feedback de calidad sin fricción. Diseña tareas, comparte un enlace y recibe sesiones grabadas con insights accionables.
      </Text>
      
    </Stack>
  </Container>
);

export default WaitlistHero;