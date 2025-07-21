import apiClient from '../../config/API/axiosConfig.mjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logError } from '../../config/logging/loggerFunctions.mjs';


const RestorePasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [passwordUpdateResponse, setPasswordUpdateResponse] = useState(null); // initialized state for response
    const [passwordResetTokenValidity, setPasswordResetTokenValidity] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    // Get a specific query parameter
    const passwordResetToken = searchParams.get('passwordResetToken');


    useEffect(() => {

        try {
            const checkPasswordResetTokenValidity = apiClient.get(`/api/v1/auth/password-reset?passwordResetToken=${passwordResetToken}`)

            setLoading(false)
            
            if (checkPasswordResetTokenValidity.success === true) {
                setPasswordResetTokenValidity(checkPasswordResetTokenValidity)

            }
            
            
            
        } catch (error) {
                console.error('Error fetching analysis data:', error);
                setError(error.message);
                setLoading(false);   
        }


    }, [passwordResetToken])

    const updateRecoveredPassword = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                passwordResetToken: passwordResetToken,
                newPassword: e.target.newPassword.value,
                confirmNewPassword: e.target.confirmNewPassword.value,
            };

            const response = await apiClient.patch(`/api/v1/auth/password-reset`, formData);

            setPasswordUpdateResponse(response.data);
        } catch (error) {
            logError('Failed to update recovered password', error);
        }
    };
    
    return (
<>
        {passwordUpdateResponse ? (
            <div>
                <div className={passwordUpdateResponse.success ? 'success' : 'error'}>
                    {passwordUpdateResponse.message}
                </div>
            </div>
        ) : (

        <div className="response">
            <h2>Update Recovered Password</h2>
            <form onSubmit={updateRecoveredPassword}>

                <label htmlFor="newPassword">new password</label>
                <input type="password" name="newPassword" placeholder="Enter your new password" required  defaultValue='password1'/>
                
                <label htmlFor="confirmNewPassword">new password</label>
                <input type="password" name="confirmNewPassword" placeholder="Confirm your new password" required defaultValue='password1' />
                <button type="submit">Update Password</button>
            </form>
        </div>
        )}
</>
    );
};

export default RestorePasswordPage;