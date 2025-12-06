import { Card, Title, Text, Container, AspectRatio, Stack } from '@mantine/core';

const DashboardExample = () => {
  return (
    <Stack align="center" gap="xl">
      <Title order={2} ta="center" w="100%" maw="1140px">
        Observa cómo usan tu producto, clic a clic
      </Title>
      <Text size="lg" ta="center" c="dimmed" w="100%" maw="1140px">
        Mira la pantalla, escucha sus comentarios en voz alta y entiende qué les frena o les motiva en sus propios contextos
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