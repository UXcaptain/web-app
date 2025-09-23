import { useState } from 'react'
import apiClient from '../../config/API/axiosConfig.mjs'
import { Container, Stack, Card, Title, Text, Group, Button, Alert, Loader, Center, Badge, SimpleGrid, List } from '@mantine/core'
import { useSubscription } from '../../contexts/SubscriptionContext.jsx'

const UserBilling = () => {
  const { subscription, stripeCustomerId, loading, error, isPaid } = useSubscription()
  const [actionError, setActionError] = useState(null)

  const handlePriceLink = async (planName, billingCycle) => {
    const data = {
      planName: planName,
      planBillingCycle: billingCycle
    }

    try {
      setActionError(null)
      const response = await apiClient.post(`/api/v1/billing/checkout-session`, data)
      const { checkoutSessionUrl } = response.data
      window.open(checkoutSessionUrl, '_blank')
    } catch (err) {
      if (err.status === 400) {
              return setActionError('El usuario ya tiene una suscripción existente, gestiónala en el portal')
            }
      return setActionError(err.message)
    }
  }

  const handleBillingCustomerPortal = async () => {
    try {
      setActionError(null)
      const response = await apiClient.post(`/api/v1/billing/customer-portal`)
      const { customerPortalUrl } = response.data
      window.open(customerPortalUrl, '_blank')
    } catch (err) {
      setActionError(err.message)
    }
  }

  // Derived billing state (kept minimal due to API payload shape)
    const hasSubscription = Boolean(subscription?.id)
    const paidCycle = ''
    const isCurrentMonthly = false
    const isTrialing = false

  if (loading) {
    return (
      <Center h={200}>
        <Stack gap="xs" align="center">
          <Loader />
                    <Text c="dimmed" size="sm">Cargando información de facturación...</Text>
        </Stack>
      </Center>
    )
  }

  const combinedError = actionError || error
  if (combinedError) {
    return (
      <Container size="sm">
        <Alert color="red" title="Error">{combinedError}</Alert>
      </Container>
    )
  }

  return (
    <Container size="sm">
      <Stack gap="lg">
        {subscription && isPaid && (
                  <Card withBorder p="lg" radius="md">
                    <Title order={3}>Suscripción actual</Title>
            <Group gap="sm" mt="sm">
              <Badge color="green">Activo</Badge>
                            <Text fw={500}>
                              ID de suscripción: {subscription.id}
                            </Text>
              {paidCycle && (
                <Badge variant="light" color="blue">{paidCycle}</Badge>
              )}
            </Group>
          </Card>
        )}

        {/* Only keep indication that the free trial has ended */}
                {!isTrialing && !isPaid && (
                  <Alert color="gray" variant="light" title="Prueba finalizada">
                    Tu prueba gratuita ha finalizado. Elige un plan de pago para continuar.
                  </Alert>
                )}

        <Title order={2}>Planes de precios</Title>

        <SimpleGrid cols={1} spacing="lg">
                          <Card
                            withBorder
                            p="lg"
                            radius="md"
                            style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 280 }}
                          >
                            <Title order={3}>Suscripción Mensual</Title>
                                        <Group align="center" mt="xs">
                                          <Text fw={700} size="xl">€29/mes</Text>
                                          <Text size="sm" c="dimmed">IVA incluido</Text>
                                        </Group>
                                        {/* hidden placeholder to keep cards identical in height distribution */}
                                                    <Text c="teal" size="sm" mt={4} style={{ visibility: 'hidden' }}>Ahorra 17%</Text>
                                                    <Text c="dimmed" mt="xs">Utiliza la plataforma sin límites.</Text>
                                                    <Button
                              mt="auto"
                              fullWidth
                              variant={isCurrentMonthly ? 'filled' : 'outline'}
                              disabled={isCurrentMonthly}
                              onClick={() => !isCurrentMonthly && handlePriceLink('basic', 'monthly')}
                            >
                              {isCurrentMonthly ? 'Plan actual' : 'Elegir Mensual'}
                            </Button>
                          </Card>
                        </SimpleGrid>

        <Card withBorder p="lg" radius="md">
                  <Title order={3}>Historial de facturas</Title>
                  <Text c="dimmed" mt="xs">
                    Encuentra tus facturas y gestiona los métodos de pago y la suscripción.
                  </Text>
          <Group mt="md">
                      <Button onClick={handleBillingCustomerPortal}>Abrir portal del cliente</Button>
                    </Group>
        </Card>
      </Stack>
    </Container>
  )
}

export default UserBilling