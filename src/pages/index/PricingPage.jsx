import { Container, Title, Text, Card, List, ThemeIcon, Stack, SimpleGrid, Group, Anchor } from '@mantine/core';
import { IconHelpCircle, IconShieldCheck, IconUsersPlus } from '@tabler/icons-react';
import RegisterButton from '../../components/navBarElements/RegisterButton.jsx';
import BetaBadge from '../../components/shared/BetaBadge.jsx';
import { PLANS } from '../../config/plans.js';

const PlanCard = ({ plan }) => (
  <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
    <Title order={3} mb="md">{plan.name}</Title>
    
    <Title order={2} mb="xs" style={{ textDecoration: 'line-through', color: '#999' }}>
      {plan.price}{plan.currency} / {plan.period}
    </Title>
    
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
      <BetaBadge />
    </div>

    <Text c="dimmed" size="sm" mb="md">
      {plan.subtitle}
    </Text>

    <List spacing="sm" size="sm" mb="xl" style={{ textAlign: 'left', display: 'inline-block' }}>
      {plan.features.map((feature, index) => (
        <List.Item
          key={index}
          icon={
            <ThemeIcon size={20} radius="xl" color="green">
              ✓
            </ThemeIcon>
          }
        >
          {feature}
        </List.Item>
      ))}
    </List>

    <div>
      <RegisterButton />
    </div>
  </Card>
);

const CONTACT_EMAIL_HREF = 'mailto:hello@company.com';
const DEMO_URL_HREF = 'https://cal.com/your-org/your-event';
const InfoCard = ({ icon: Icon, title, children }) => (
  <Card
    radius="lg"
    p="xl"
    shadow="sm"
    style={{ height: '100%' }}
  >
    <Group align="flex-start" wrap="nowrap" gap="lg">
      <Card withBorder radius="md" p="md" shadow="sm" style={{ flexShrink: 0 }}>
        <Icon size={28} stroke={1.5} />
      </Card>

      <div>
        <Title order={4} mb={6}>
          {title}
        </Title>

        <Text c="dimmed">
          {children}
        </Text>
      </div>
    </Group>
  </Card>
);

export const PricingPage = () => {
  const plansArray = Object.values(PLANS);
  
  return (
    <Container py="xl" size="lg">
      <Stack align="center" gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={2}>Planes y precios</Title>
          <Text c="dimmed" mt="xs" style={{ maxWidth: 640, marginInline: 'auto' }}>
            Un único plan simple para empezar hoy mismo. Sin complicaciones, cancela cuando quieras.
          </Text>
        </div>

        <div style={{ width: '100%', maxWidth: plansArray.length === 1 ? 420 : 'none', margin: '0 auto' }}>
          <SimpleGrid cols={{ base: 1, sm: plansArray.length }} spacing="xl" style={{ width: '100%' }}>
            {plansArray.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </SimpleGrid>
        </div>

        <Card
          radius="md"
          p="xl"
          style={{ width: '100%' }}
        >
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            <InfoCard icon={IconShieldCheck} title="Garantía de satisfacción 100%">
              Si no estás contento con uno de nuestros participantes, te asignaremos otro sin coste adicional.
            </InfoCard>

            <InfoCard icon={IconUsersPlus} title="¿Necesitas más participantes?">
              Puedes mejorar tu plan en cualquier momento o comprar más participantes bajo demanda.
            </InfoCard>

            <InfoCard icon={IconHelpCircle} title="¿Aún tienes preguntas?">
              Puedes{' '}
              <Anchor href={CONTACT_EMAIL_HREF} underline="always">
                contactarnos
              </Anchor>{' '}
              o{' '}
              <Anchor href={DEMO_URL_HREF} target="_blank" rel="noreferrer" underline="always">
                reservar una demo
              </Anchor>
              .
            </InfoCard>
          </SimpleGrid>
        </Card>
      </Stack>
    </Container>
  );
};