import { IconArrowLeft } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './ForgotPassword.module.css';
import { Link } from 'react-router';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useState } from 'react';


 const ForgotPasswordForm = () => {
    
  const [recoverPasswordResponse, setRecoverPasswordResponse] = useState(null);
  const [recoverPasswordError, setRecoverPasswordError] = useState(null);

    const recoverPasswordRequest = async (e) => {
        
        e.preventDefault();

        const data = {
            email: e.target.email.value
        }

        try {
            const response = await apiClient.post(`/api/v1/auth/recoverPassword`, data);
            setRecoverPasswordResponse(response.data);
            setRecoverPasswordError(null);

        } catch (error) {

            setRecoverPasswordError({ success: false, message: "Error recovering password." });
            console.error("Error recovering password:", error);
            setRecoverPasswordResponse(null);
        }
    } 
  
  
    return (
    <Container size={460} my={30}>

        

      <Title className={classes.title} ta="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      {recoverPasswordResponse && (
                          <Paper shadow="xs" p={10} mt={20} radius="sm" style={{ backgroundColor: '#ccffcc' }}>
                            {recoverPasswordResponse.message}
                          </Paper>
                        )}

      {recoverPasswordError && recoverPasswordError.success === false && (
        <Paper shadow="xs" p={10} mt={20} radius="sm" style={{ backgroundColor: '#ffcccc' }}>
          {recoverPasswordError.message}
        </Paper>
      )}

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={recoverPasswordRequest} method="post">
        <TextInput name="email" label="Your email" placeholder="me@mantine.dev" required />
        <Group justify="space-between" mt="lg" className={classes.controls}>
          <Anchor c="dimmed" component={Link} to="/auth/login" size="sm" className={classes.control}>
            <Center inline>
              <IconArrowLeft size={12} stroke={1.5} />
              <Box ml={5}>Back to the login page</Box>
            </Center>
                
          </Anchor>
          <Button type="submit" className={classes.control}>Reset password</Button>
        </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default ForgotPasswordForm;