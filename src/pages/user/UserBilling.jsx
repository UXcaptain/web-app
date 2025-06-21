import { useState, useEffect } from 'react'
import apiClient from '../../config/API/axiosConfig.mjs'


const UserBilling = () => {
    
    const [stripeCustomerId, setStripeCustomerId] = useState(null)
    const [error, setError] = useState(null)
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await apiClient.get('/api/v1/billing');

                setLoading(false)
                return setSubscriptionData(response.data.subscriptionData);
            } catch (err) {
                setError(err.message);
            }
        };
    
        if (!subscriptionData) {
            checkSubscription();
        }
    }, [subscriptionData]);


        const handlePriceLink = async (planName, billingCycle) => {
            
            const data = {
                planName: planName,
                planBillingCycle: billingCycle, 

            }
            
            try {

                const response = await apiClient.post(`/api/v1/billing/checkout-session`, data);

                const { checkoutSessionUrl } = response.data;

                return window.open(checkoutSessionUrl, '_blank');
                
            } catch (err) {

                if (err.status === 400) {
                    return setError('User has an existing subscription, manage it on the portal');
                }

                return setError(err.message)
            }
        }


        useEffect(() => {
            const createCustomerInStripe = async () => {
                try {
                    const response = await apiClient.post('/api/v1/billing');
                    return setStripeCustomerId(response.data.customerId);
                } catch (err) {

                    if (error.code === 400) {
                        return setLoading(false)
                    }

                    setError(err.message);
                }
            };
        
            if (!stripeCustomerId) {
                createCustomerInStripe();
            }
        }, [stripeCustomerId]);


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
            {(subscriptionData && subscriptionData.status === 'active') ? (
                <>
                    <div className="currentPlan">
                        <p>current plan: {subscriptionData.plan_name}</p>
                    </div>
                    
                    <div className="billingSection">
                        <h2>billing</h2>
                        <p>find all your invoices and such</p>
                        <button onClick={handleBillingCustomerPortal}>click here for billing stuff</button>
                    </div>
                </>
            ) : (
                <div className="Plans">
                    <h2>Available Plans</h2>
                    <div className="monthlyPlan">
                        <h1>Free</h1>
                        <p>includes free stuff</p>
                        <button onClick={() => {handlePriceLink('basic', 'monthly') }}>pick monthly plan</button>
                    </div>

                    <div className="annualPlan">
                        <h1>Pro</h1>
                        <p>includes annual stuff</p>
                        <button onClick={() => {handlePriceLink('basic', 'annual') }}>pick annual plan</button>
                    </div>

                    <div className="billingSection">
                        <h2>billing</h2>
                        <p>find all your invoices and such</p>
                        <button onClick={handleBillingCustomerPortal}>click here for billing stuff</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default UserBilling;