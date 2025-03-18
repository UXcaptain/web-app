import apiClient from '../../config/API/axiosConfig.mjs'
import { useState } from 'react'
import { logError } from '../../config/logging/loggerFunctions.mjs'
const UpdatePasswordPage = () => {

    const [response, setResponse] = useState({
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const passwordUpdateData = {
                currentPassword: e.target.currentPassword.value,
                newPassword: e.target.newPassword.value,
            };

            const response = await apiClient.patch(`/api/v1/auth/updateUserPassword`, passwordUpdateData)
            setResponse({
                success: true,
                message: response.data.message
            })

        } catch (error) {

            logError('Failed to update password', error);

            if (error.response && error.response.status === 401) {
                setResponse({
                    success: false,
                    message: error.response.data.message
                })
            } else if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                
                // Check if message is an array of validation objects
                if (Array.isArray(errorMessage)) {
                    setResponse({
                        success: false,
                        message: errorMessage.map(err => err.msg)
                    })
                } else {
                    setResponse({
                        success: false,
                        message: errorMessage
                    })
                }
            } else {
                // Handle other errors (network errors, server errors, etc)
                setResponse({
                    success: false,
                    message: 'An unexpected error occurred. Please try again.'
                })
            }
        }
        
    }

    return (
        <>
            <div>
                {response && (
                    <div className="responseContainer">
                        {response.success === false && (
                            <div className="errorDiv">
                                {Array.isArray(response.message) ? (
                                    <ul>
                                        {response.message.map((msg, index) => (
                                            <li key={index}>{msg}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{response.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <h1>Update Password</h1>
                <form onSubmit={handleSubmit}>
                    <input type="password" name="currentPassword" placeholder="Current Password" defaultValue='password' /> 
                    <input type="password" name="newPassword" placeholder="New Password" defaultValue='password' />
                    <button type="submit">Update Password</button>
                </form>
            </div>
        </>
    )
}

export default UpdatePasswordPage