import { Container, Stack, Title, Text, Group } from '@mantine/core';
import RegisterButton from '../../../components/navBarElements/RegisterButton';
import BetaBadge from '../../../components/shared/BetaBadge';


const MainHero = () => (
  <Container size="lg" py="xl">
    <Stack align="center" gap="xl">
      <Title order={1} ta="center">
        La forma más fácil y económica de probar tus sitios web, apps y prototipos con usuarios reales
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        UXcaptain te muestra qué funciona en tu producto… y qué no. Una herramienta sencilla con la que puedes crear un análisis con usuarios no moderados en minutos y recibir resultados en solo unas horas.
      </Text>
      <Group>
        <RegisterButton />
      </Group>
      <BetaBadge />
    </Stack>
  </Container>
);

export default MainHero;