import { useState, useEffect } from 'react'
import apiClient from '../../config/API/axiosConfig.mjs'
import { Container, Stack, Card, Title, Text, Group, Button, Alert, Loader, Center, Badge, SimpleGrid } from '@mantine/core'

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
        setSubscriptionData(response.data.billingData?.Subscription?.[0] || null)
        setStripeCustomerId(
          response.data.billingData?.stripe_id ??
          response.data.billingData?.stripe_customer_id ??
          null
        )
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!subscriptionData && !stripeCustomerId) {
      checkSubscription()
    } else {
      // if we already have either, stop loading to render UI based on what we have
      setLoading(false)
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
      const cid =
        response.data?.customerId ??
        response.data?.billingData?.stripe_id ??
        response.data?.stripeCustomerId ??
        response.data?.stripe_id ??
        null
      setStripeCustomerId(cid)
      setCustomerBillingIdCreated(Boolean(cid))
    } catch (err) {
      // silently ignore - will retry later
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

  // Derived billing state adapted to minimal API payload
  // Treat presence of a Subscription id as "has an active subscription"
  const hasSubscription = Boolean(subscriptionData?.id)
  const isPaid = hasSubscription
  // Billing cycle is unknown with the new payload; default to empty string
  const paidCycle = ''
  // Without plan interval info, these are always false
  const isCurrentMonthly = false
  const isCurrentAnnual = false
  // No trial information provided in the new payload
  const isTrialing = false

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
      <Stack gap="lg">
        {subscriptionData && isPaid && (
          <Card withBorder p="lg" radius="md">
            <Title order={3}>Current subscription</Title>
            <Group gap="sm" mt="sm">
              <Badge color="green">Active</Badge>
              <Text fw={500}>
                Subscription ID: {subscriptionData.id}
              </Text>
              {paidCycle && (
                <Badge variant="light" color="blue">{paidCycle}</Badge>
              )}
            </Group>
          </Card>
        )}

        {/* Only keep indication that the free trial has ended */}
        {!isTrialing && !isPaid && (
          <Alert color="gray" variant="light" title="Trial ended">
            Your free trial has ended. Choose a paid plan to continue.
          </Alert>
        )}

        <Title order={2}>Pricing plans</Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Card
            withBorder
            p="lg"
            radius="md"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 280 }}
          >
            <Title order={3}>Pro Monthly</Title>
            <Text fw={700} size="xl" mt="xs">€19/month</Text>
            {/* hidden placeholder to keep cards identical in height distribution */}
            <Text c="teal" size="sm" mt={4} style={{ visibility: 'hidden' }}>Save 17%</Text>
            <Text c="dimmed" mt="xs">Best for flexibility. Billed monthly.</Text>
            <Button
              mt="auto"
              fullWidth
              variant={isCurrentMonthly ? 'filled' : 'outline'}
              disabled={isCurrentMonthly}
              onClick={() => !isCurrentMonthly && handlePriceLink('basic', 'monthly')}
            >
              {isCurrentMonthly ? 'Current plan' : 'Choose Monthly'}
            </Button>
          </Card>

          <Card
            withBorder
            p="lg"
            radius="md"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 280 }}
          >
            <Title order={3}>Pro Annual</Title>
            <Text fw={700} size="xl" mt="xs">€190/year</Text>
            <Text c="teal" size="sm" mt={4}>Save 17%</Text>
            <Text c="dimmed" mt="xs">Best value. Billed annually.</Text>
            <Button
              mt="auto"
              fullWidth
              variant={isCurrentAnnual ? 'filled' : 'outline'}
              disabled={isCurrentAnnual}
              onClick={() => !isCurrentAnnual && handlePriceLink('basic', 'annual')}
            >
              {isCurrentAnnual ? 'Current plan' : 'Choose Annual'}
            </Button>
          </Card>
        </SimpleGrid>

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
    </Container>
  )
}

export default UserBilling