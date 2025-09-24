import { Container, Stack, Title, Text, Group, Button } from '@mantine/core';
import RegisterButton from '../../../components/navBarElements/RegisterButton';


const MainHero = () => (
  <Container size="lg" py="xl">
    <Stack align="center" gap="xl">
      <Title order={1} ta="center">
        Feedback de calidad, en minutos
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        Recibe videos de usuarios reales interactuando con tus productos mientras comparten su feedback, identifica pain points y mejora tus productos
      </Text>
      {/* <Group>
        <RegisterButton /> // TODO ENABLE ON LAUNCH
      </Group> */}
    </Stack>
  </Container>
);

export default MainHero;