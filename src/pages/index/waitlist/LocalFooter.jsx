import { Container, Group, Anchor } from '@mantine/core';

const WaitlistLocalFooter = () => (
  <Container size="lg" py="xl">
    <Group justify="center" gap="xl">
      <Anchor href="/" size="sm">
        Inicio
      </Anchor>
      <Anchor href="/terminos-condiciones" size="sm">
        Términos y condiciones
      </Anchor>
      <Anchor href="/preguntas-frecuentes" size="sm">
        Preguntas frecuentes
      </Anchor>
      <Anchor href="/auth/login" size="sm">
        Acceder
      </Anchor>
      <Anchor href="/auth/register" size="sm">
        Crear cuenta
      </Anchor>
    </Group>
  </Container>
);

export default WaitlistLocalFooter;