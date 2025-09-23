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

const CustomerRegistrationForm = () => {

const [registerResponse, setRegisterResponse] = useState(null)
const [registerError, setRegisterError] = useState(null)

const handleRegister = async (e) => {
    e.preventDefault()

    const data = {
        username: e.target.username.value,
        password: e.target.password.value,
        role: 'customer',
    }
    
    try {
        const registerResponse = await apiClient.post(`/api/v1/auth/register/local/customer`, data)
        
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
                message: 'El nombre de usuario ya existe'
            })
        }

        if (err.status === 422) {
            return setRegisterError({
                success: false,
                message: 'Por favor, proporcione un correo electrónico y contraseña válidos'
            })
        }

        logError('Registration failed', err, 'N/A')

        return setRegisterError({
            success: false,
            message: 'Error interno, por favor intente nuevamente en unos minutos'
        })
    }
}

return (
    <>
                        <Container size={420} my={40}>
                        <Title ta="center" className={classes.title}>
                          ¡Hola!
                        </Title>
                        <Text c="dimmed" size="sm" ta="center" mt={5}>
                          ¿Ya tienes una cuenta?{' '}
                          <Anchor component={Link} to="/auth/login" size="sm">
                            Iniciar sesión
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
                            <TextInput name="username" label="Correo electrónico" placeholder="tu@ejemplo.com" required  />
                            <PasswordInput name="password" label="Contraseña" placeholder="Tu contraseña" required mt="md" />

                            <Button type="submit" fullWidth mt="xl">
                              Registrarse
                            </Button>
                          </form>
                        </Paper>
                        </Container>
                    </>
)};

export default CustomerRegistrationForm