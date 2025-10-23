import { Container, Title, Text, Card, Group, Badge, List, ThemeIcon, Stack, SimpleGrid } from '@mantine/core';
import RegisterButton from '../../components/navBarElements/RegisterButton.jsx';
import { PLANS } from '../../config/plans.js';

const PlanCard = ({ plan }) => (
  <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
    <Title order={3} mb="md">{plan.name}</Title>
    
    <Title order={2} mb="xs" style={{ textDecoration: 'line-through', color: '#999' }}>
      {plan.price}{plan.currency} / {plan.period}
    </Title>
    
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
      <Badge
        size="lg"
        variant="filled"
        color="green"
      >
        100% Gratis durante la beta
      </Badge>
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
      </Stack>
    </Container>
  );
};