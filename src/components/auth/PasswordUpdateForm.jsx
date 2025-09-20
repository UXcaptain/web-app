import { useState } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { logError } from '../../config/logging/loggerFunctions.mjs';
import { Card, Button, TextInput, Text, Alert, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const PasswordUpdateForm = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const passwordUpdateData = {
                currentPassword: e.target.currentPassword.value,
                newPassword: e.target.newPassword.value,
            };

            const response = await apiClient.patch(`/api/v1/auth/update-user-password`, passwordUpdateData);
            setResponse({
                success: true,
                message: response.data.message
            });

        } catch (error) {
            logError('Failed to update password', error);

            if (error.response && error.response.status === 401) {
                setResponse({
                    success: false,
                    message: error.response.data.message
                });
            } else if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                
                // Check if message is an array of validation objects
                if (Array.isArray(errorMessage)) {
                    setResponse({
                        success: false,
                        message: errorMessage.map(err => err.msg)
                    });
                } else {
                    setResponse({
                        success: false,
                        message: errorMessage
                    });
                }
            } else {
                // Handle other errors (network errors, server errors, etc)
                setResponse({
                    success: false,
                    message: 'An unexpected error occurred. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
            <Text size="lg" weight={600} mb="md">Update Password</Text>
            
            {response && (
                <Box mb="md">
                    {response.success === false ? (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
                            {Array.isArray(response.message) ? (
                                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                    {response.message.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Text>{response.message}</Text>
                            )}
                        </Alert>
                    ) : (
                        <Alert title="Success" color="green">
                            <Text>{response.message}</Text>
                        </Alert>
                    )}
                </Box>
            )}
            
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    required
                    mb="md"
                />
                
                <TextInput
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    required
                    mb="md"
                />
                
                <Button 
                    type="submit" 
                    loading={loading}
                    fullWidth
                >
                    Update Password
                </Button>
            </form>
        </Card>
    );
};

export default PasswordUpdateForm;