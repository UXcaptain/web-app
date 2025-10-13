import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../config/API/axiosConfig.mjs';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return ctx;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerBillingIdCreated, setCustomerBillingIdCreated] = useState(false);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/billing');
      const billingData = response.data?.billingData || {};
      const subscriptionObj = billingData?.Subscription?.[0] || null;
      const stripeId =
        billingData?.stripe_id ??
        billingData?.stripe_customer_id ??
        null;

      setSubscription(subscriptionObj);
      setStripeCustomerId(stripeId);
    } catch (err) {
      setError(err?.message ?? 'Failed to fetch subscription');
      try {
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomerBillingId = useCallback(async () => {
    try {
      const response = await apiClient.post('/api/v1/billing');
      const cid =
        response.data?.customerId ??
        response.data?.billingData?.stripe_id ??
        response.data?.stripeCustomerId ??
        response.data?.stripe_id ??
        null;

      if (cid) {
        setStripeCustomerId(cid);
        setCustomerBillingIdCreated(true);
      }
      return cid;
    } catch (err) {
      try {
      } catch (_) {}
      return null;
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (!customerBillingIdCreated && stripeCustomerId === null && !loading) {
      createCustomerBillingId().finally(() => {
        // Attempt to refresh details after trying to create the customer id
        fetchSubscription();
      });
    }
  }, [stripeCustomerId, customerBillingIdCreated, loading, createCustomerBillingId, fetchSubscription]);

  const hasActiveSubscription = Boolean(
    subscription?.id && subscription?.expires_at && new Date(subscription.expires_at) > new Date()
  );

  const value = {
    subscription,
    stripeCustomerId,
    hasActiveSubscription,
    loading,
    error,
    refresh: fetchSubscription,
    createCustomerBillingId,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

SubscriptionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SubscriptionContext;