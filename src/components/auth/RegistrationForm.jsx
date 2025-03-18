import apiClient from "../../config/API/axiosConfig.mjs"
import { useState } from "react"
import { logError } from "../../config/logging/loggerFunctions.mjs"
import { Link } from "react-router";
import {
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';
  import classes from './AuthenticationTitle.module.css';

const RegistrationForm = () => {

const [registerResponse, setRegisterResponse] = useState(null)
const [registerError, setRegisterError] = useState(null)

const handleRegister = async (e) => {
    e.preventDefault()

    const data = {
        username: e.target.username.value,
        password: e.target.password.value
    }
    
    try {
        const registerResponse = await apiClient.post(`/api/v1/auth/register/local`, data)
        
        setRegisterResponse({
            success: true,
            message: registerResponse.data.message
        })

        setRegisterError(null)
        
    } catch (err) {

        setRegisterResponse(null)

        if (err.status === 409) {
            return setRegisterError({
                success: false,
                message: 'Username already exists'
            })
        }

        if (err.status === 422) {
            return setRegisterError({
                success: false,
                message: 'Please provide a valid email and password'
            })
        }

        logError('Registration failed', err, 'N/A')

        return setRegisterError({
            success: false,
            message: 'Internal error, please try again in a few minutes'
        })
    }
}

return (
    <>
                        <Container size={420} my={40}>
                        <Title ta="center" className={classes.title}>
                          Welcome back!
                        </Title>
                        <Text c="dimmed" size="sm" ta="center" mt={5}>
                          Already have an account?{' '}
                          <Anchor component={Link} to="/auth/login" size="sm">
                            Log in
                          </Anchor>

                        </Text>

                        {registerResponse && (
                          <Paper shadow="xs" p={10} mt={20} radius="sm" style={{ backgroundColor: '#ccffcc' }}>
                            {registerResponse.message}
                          </Paper>
                        )}

                        {registerError && registerError.success === false && (
                          <Paper shadow="xs" p={10} mt={20} radius="sm" style={{ backgroundColor: '#ffcccc' }}>
                            {registerError.message}
                          </Paper>
                        )}
                        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                          <form onSubmit={handleRegister}>
                            <TextInput name="username" label="username" placeholder="you@mantine.dev" required defaultValue="username@gmail.com" />
                            <PasswordInput name="password" label="password" placeholder="Your password" required mt="md" defaultValue="password" />

                            <Button type="submit" fullWidth mt="xl">
                              Register
                            </Button>
                          </form>
                        </Paper>
                        </Container>
                    </>
)};

export default RegistrationForm