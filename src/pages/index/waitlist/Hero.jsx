import { Container, Stack, Title, Text, Group } from '@mantine/core';
import RegisterButton from '../../../components/navBarElements/RegisterButton';
import BetaBadge from '../../../components/shared/BetaBadge';


const MainHero = () => (
  <Container size="lg" py="xl">
    <Stack align="center" gap="xl">
      <BetaBadge />
      <Title order={1} ta="center">
        Descubre cómo personas reales usan tu producto, en vídeo y audio
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        Graba la pantalla y la voz de clientes y equipos internos mientras completan tareas en tu web, app o prototipo, y detecta problemas de UX en minutos.
      </Text>
      <Group>
        <RegisterButton />
      </Group>
    </Stack>
  </Container>
);

export default MainHero;