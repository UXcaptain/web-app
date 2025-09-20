import { Alert, Group, Button, Text } from '@mantine/core'
import { useNavigate, useLocation } from 'react-router'
import { useSubscription } from '../../contexts/SubscriptionContext.jsx'

const TrialEndedBanner = () => {
  const { hasActiveSubscription, loading, error } = useSubscription()
  const navigate = useNavigate()
  const location = useLocation()

  const onBillingPage = location?.pathname?.includes('/user/billing')

  if (loading || error || hasActiveSubscription || onBillingPage) {
    return null
  }

  return (
    <Alert color="yellow" variant="light" title="Trial ended">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Text>Your free trial has ended. Choose a paid plan to continue.</Text>
        <Button size="xs" variant="filled" onClick={() => navigate('/user/billing')}>
          Choose plan
        </Button>
      </Group>
    </Alert>
  )
}

export default TrialEndedBanner