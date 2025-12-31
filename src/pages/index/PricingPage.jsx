import { Container, Title, Text, Card, List, ThemeIcon, Stack, SimpleGrid, Group, Anchor, Box, Flex, Tooltip, ActionIcon, Badge } from '@mantine/core';
import { IconCheck, IconHelpCircle, IconShieldCheck, IconUsersPlus, IconX } from '@tabler/icons-react';
import RegisterButton from '../../components/navBarElements/RegisterButton.jsx';
import { PLANS } from '../../config/plans.js';

const PlanCard = ({ plan }) => (
  <Card 
    withBorder 
    shadow={plan.id === 'starter' ? 'md' : 'sm'} 
    radius="md" 
    p="lg" 
    style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      borderColor: plan.id === 'starter' ? 'var(--mantine-color-blue-6)' : undefined,
      borderWidth: plan.id === 'starter' ? '2px' : undefined
    }}
  >
    <Flex direction="column" h="100%">
      <Box>
        <Group justify="center" mb="xs">
          {plan.id === 'starter' && (
            <Badge 
              color="blue" 
              variant="filled" 
              size="lg" 
              radius="sm"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              Más Popular
            </Badge>
          )}
        </Group>
        <Title order={3} mb="md" ta="center">{plan.name}</Title>

        <Title order={2} mb="xs" ta="center">
          {plan.price}{plan.currency} / {plan.period}
        </Title>

        <Text c="dimmed" size="sm" mb="md" ta="center">
          {plan.subtitle}
        </Text>

        <List spacing="sm" size="sm" mb="xl" style={{ textAlign: 'left' }}>
          {plan.features
            .map((feature, index) => {
              const normalized =
                typeof feature === 'string'
                  ? { key: `${feature}-${index}`, label: feature, included: true, helpText: undefined }
                  : feature;
              return normalized;
            })
            .sort((a, b) => (b.included === a.included ? 0 : b.included ? 1 : -1))
            .map((feature, index) => (
              <List.Item
                key={feature.key ?? index}
                icon={
                  <ThemeIcon
                    size={20}
                    radius="xl"
                    color={feature.included ? 'green' : 'gray'}
                    variant={feature.included ? 'filled' : 'light'}
                  >
                    {feature.included ? <IconCheck size={14} /> : <IconX size={14} />}
                  </ThemeIcon>
                }
              >
                <Group gap={6} wrap="nowrap" align="center">
                  <Text span c={feature.included ? undefined : 'dimmed'}>
                    {feature.label}
                  </Text>

                  {feature.helpText && (
                    <Tooltip
                      label={feature.helpText}
                      withArrow
                      position="top"
                      multiline
                      w={320}
                      withinPortal
                      zIndex={10000}
                      openDelay={150}
                    >
                      <span style={{ display: 'inline-flex' }}>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          aria-label="Más información"
                          style={{ cursor: 'help' }}
                        >
                          <IconHelpCircle size={16} stroke={1.75} />
                        </ActionIcon>
                      </span>
                    </Tooltip>
                  )}
                </Group>
              </List.Item>
            ))}
        </List>
      </Box>

      <Box mt="auto">
        <Group justify="center">
          <RegisterButton />
        </Group>
      </Box>
    </Flex>
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
            Elige el plan que mejor se ajuste a tu equipo. Sin complicaciones, cancela cuando quieras.
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