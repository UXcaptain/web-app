import { useState, useEffect } from 'react'
import apiClient from '../../config/API/axiosConfig.mjs'

const UserBilling = () => {
    const [stripeCustomerId, setStripeCustomerId] = useState(null)
    const [error, setError] = useState(null)
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerBillingIdCreated, setCustomerBillingIdCreated] = useState(false);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await apiClient.get('/api/v1/billing');
                setSubscriptionData(response.data.billingData.Subscription[0]);
                setStripeCustomerId(response.data.billingData.stripe_customer_id);
                setLoading(false);
            } catch (err) {
                setError(err.message);
            }
        };
    
        if (!subscriptionData && !stripeCustomerId) {
            checkSubscription();
        }
    }, [subscriptionData, stripeCustomerId]);

    useEffect(() => { // TODO -- fix retries to create stripeCustomerId even though it already exists
        if (!customerBillingIdCreated && stripeCustomerId === null) {
            createCustomerBillingId();
        }
    }, [stripeCustomerId, customerBillingIdCreated]);

    const createCustomerBillingId = async () => {
        try {
            const response = await apiClient.post('/api/v1/billing');
            setStripeCustomerId(response.data.customerId);
            setCustomerBillingIdCreated(true);
        } catch (err) {
            // setError(err.message);
        }
    }

    const handlePriceLink = async (planName, billingCycle) => {  
        const data = {
            planName: planName,
            planBillingCycle: billingCycle, 
        }
        
        try {
            const response = await apiClient.post(`/api/v1/billing/checkout-session`, data);
            const { checkoutSessionUrl } = response.data;
            window.open(checkoutSessionUrl, '_blank');      
        } catch (err) {
            if (err.status === 400) {
                return setError('User has an existing subscription, manage it on the portal');
            }
            return setError(err.message)
        }
    }

    const handleBillingCustomerPortal = async () => {
        try {
            const response = await apiClient.post(`/api/v1/billing/customer-portal`);
            const { customerPortalUrl } = response.data;
            window.open(customerPortalUrl, '_blank');
        } catch (error) {
            setError(error.message);
        }
    }

    if (loading) return <div>Loading</div>
    if (error) return <div>Error: {error}</div>
    
    return (
        <div>
            {(subscriptionData && subscriptionData.status === 'active' ) ? (
                <>
                    <div className="currentPlan">
                        <p>Current plan: {subscriptionData.plan_name}</p>
                    </div>
                    
                    <div className="billingSection">
                        <h2>Billing</h2>
                        <p>Find all your invoices and such</p>
                        <button onClick={handleBillingCustomerPortal}>Click here for billing stuff</button>
                    </div>
                </>
            ) : (
                <div className="plans">
                    <h2>Available Plans</h2>
                    <div className="monthlyPlan">
                        <h1>Free</h1>
                        <p>Includes free stuff</p>
                        <button onClick={() => handlePriceLink('basic', 'monthly')}>Pick monthly plan</button>
                    </div>

                    <div className="annualPlan">
                        <h1>Pro</h1>
                        <p>Includes annual stuff</p>
                        <button onClick={() => handlePriceLink('basic', 'annual')}>Pick annual plan</button>
                    </div>

                    <div className="billingSection">
                        <h2>Billing</h2>
                        <p>Find all your invoices and such</p>
                        <button onClick={handleBillingCustomerPortal}>Click here for billing stuff</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserBilling;