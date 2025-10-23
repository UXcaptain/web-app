import { Card, Title, Text, Container, AspectRatio, Stack } from '@mantine/core';

const DashboardExample = () => {
  return (
    <Stack align="center" gap="xl">
      <Title order={2} ta="center" w="100%" maw="1140px">
        Observa a los usuarios interactuar con tus productos y escucha su feedback
      </Title>
      <Text size="lg" ta="center" c="dimmed" w="100%" maw="1140px">
        Escucha feedback directo y claro mientras descubres cómo usuarios reales interactúan con tus productos - con sus personalidades únicas y dispositivos distintos en sus entornos habituales
      </Text>
      
      <AspectRatio ratio={16 / 9} mt="md" w="100%" maw="1500px">
        <img
          src="/dashboard.png"
          alt="Dashboard Example"
          style={{ width: '100%', height: '100%', borderRadius: 'var(--mantine-radius-md)', objectFit: 'contain' }}
        />
      </AspectRatio>
    </Stack>
  );
};

export default DashboardExample;