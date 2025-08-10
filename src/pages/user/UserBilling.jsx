import { useState, useEffect } from 'react'
import apiClient from '../../config/API/axiosConfig.mjs'
import { Container, Stack, Card, Title, Text, Group, Button, Alert, Loader, Center, Badge } from '@mantine/core'

const UserBilling = () => {
  const [stripeCustomerId, setStripeCustomerId] = useState(null)
  const [error, setError] = useState(null)
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customerBillingIdCreated, setCustomerBillingIdCreated] = useState(false)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await apiClient.get('/api/v1/billing')
        setSubscriptionData(response.data.billingData.Subscription[0])
        setStripeCustomerId(response.data.billingData.stripe_customer_id)
        setLoading(false)
      } catch (err) {
        setError(err.message)
      }
    }

    if (!subscriptionData && !stripeCustomerId) {
      checkSubscription()
    }
  }, [subscriptionData, stripeCustomerId])

  useEffect(() => {
    // TODO -- fix retries to create stripeCustomerId even though it already exists
    if (!customerBillingIdCreated && stripeCustomerId === null) {
      createCustomerBillingId()
    }
  }, [stripeCustomerId, customerBillingIdCreated])

  const createCustomerBillingId = async () => {
    try {
      const response = await apiClient.post('/api/v1/billing')
      setStripeCustomerId(response.data.customerId)
      setCustomerBillingIdCreated(true)
    } catch (err) {
      // setError(err.message);
    }
  }

  const handlePriceLink = async (planName, billingCycle) => {
    const data = {
      planName: planName,
      planBillingCycle: billingCycle
    }

    try {
      const response = await apiClient.post(`/api/v1/billing/checkout-session`, data)
      const { checkoutSessionUrl } = response.data
      window.open(checkoutSessionUrl, '_blank')
    } catch (err) {
      if (err.status === 400) {
        return setError('User has an existing subscription, manage it on the portal')
      }
      return setError(err.message)
    }
  }

  const handleBillingCustomerPortal = async () => {
    try {
      const response = await apiClient.post(`/api/v1/billing/customer-portal`)
      const { customerPortalUrl } = response.data
      window.open(customerPortalUrl, '_blank')
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <Center h={200}>
        <Stack gap="xs" align="center">
          <Loader />
          <Text c="dimmed" size="sm">Loading billing information...</Text>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <Container size="sm">
        <Alert color="red" title="Error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container size="sm">
      {(subscriptionData && subscriptionData.status === 'active') ? (
        <Stack gap="lg">
          <Card withBorder p="lg" radius="md">
            <Title order={3}>Current plan</Title>
            <Group gap="sm" mt="sm">
              <Badge color="green">Active</Badge>
              <Text fw={500}>{subscriptionData.plan_name}</Text>
            </Group>
          </Card>

          <Card withBorder p="lg" radius="md">
            <Title order={3}>Billing</Title>
            <Text c="dimmed" mt="xs">
              Find your invoices and manage payment methods and subscription.
            </Text>
            <Group mt="md">
              <Button onClick={handleBillingCustomerPortal}>Open customer portal</Button>
            </Group>
          </Card>
        </Stack>
      ) : (
        <Stack gap="lg">
          <Title order={2}>Available Plans</Title>

          <Group align="stretch" gap="lg" grow>
            <Card withBorder p="lg" radius="md">
              <Title order={3}>Free</Title>
              <Text c="dimmed" mt="xs">Includes free stuff</Text>
              <Button mt="md" variant="light" onClick={() => handlePriceLink('basic', 'monthly')}>
                Pick monthly plan
              </Button>
            </Card>

            <Card withBorder p="lg" radius="md">
              <Title order={3}>Pro</Title>
              <Text c="dimmed" mt="xs">Includes annual stuff</Text>
              <Button mt="md" onClick={() => handlePriceLink('basic', 'annual')}>
                Pick annual plan
              </Button>
            </Card>
          </Group>

          <Card withBorder p="lg" radius="md">
            <Title order={3}>Billing</Title>
            <Text c="dimmed" mt="xs">Find all your invoices and such</Text>
            <Button mt="md" variant="outline" onClick={handleBillingCustomerPortal}>
              Open customer portal
            </Button>
          </Card>
        </Stack>
      )}
    </Container>
  )
}

export default UserBilling