import { Card, Title, Text, Container, AspectRatio } from '@mantine/core';

const DashboardExample = () => {
  return (
    <Container size="lg" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Observa a los usuarios interactuar con tus productos y escucha su feedback
        </Title>
        
        <Text size="md" c="dimmed" ta="center" mb="md">
          Escucha feedback directo y claro mientras descubres cómo usuarios reales interactúan con tus productos - con sus personalidades únicas y dispositivos distintos en sus entornos habituales
        </Text>
        
        <AspectRatio ratio={16 / 9} mt="md">
          <img
            src="/dashboard.png"
            alt="Dashboard Example"
            style={{ width: '100%', height: '100%', borderRadius: 'var(--mantine-radius-md)', objectFit: 'contain' }}
          />
        </AspectRatio>
        
      </Card>
    </Container>
  );
};

export default DashboardExample;