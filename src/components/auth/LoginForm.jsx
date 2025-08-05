import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import classes from './AuthenticationTitle.module.css';
import apiClient from '../../config/API/axiosConfig.mjs';
import { Link } from "react-router";

export function LoginForm() {
  const navigate = useNavigate();
  const [loginResponse, setLoginResponse] = useState(null);
  const [participantMessage, setParticipantMessage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setLoginResponse(null);
    setParticipantMessage(false);

    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    try {
      const loginResponse = await apiClient.post('/api/v1/auth/login/local', data);

      switch (loginResponse.data.user.role) {
        case "admin":
          return navigate('/admin');
        case "customer":
          return navigate('/dashboard');
        default:
          return navigate('/');
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        setParticipantMessage(true);
      }
      else if (error.response?.status === 401) {
        setLoginResponse({
          type: 'error',
          message: 'The combination of email and password is incorrect'
        });
      } else {
        setLoginResponse({
          type: 'error',
          message: 'Internal error, please try again later'
        });
      }
    }
  };
  
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor component={Link} to="/auth/register" size="sm">
          Create account
        </Anchor>
      </Text>
      
      {participantMessage && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Participant Login"
          color="yellow"
          mt={20}
        >
          Participant login is not available yet. Please contact support for more information.
        </Alert>
      )}
      
      {loginResponse && (
        <Alert
          icon={loginResponse.type === 'error' ? <IconAlertCircle size={16} /> : <IconCheck size={16} />}
          color={loginResponse.type === 'error' ? 'red' : 'green'}
          mt={20}
        >
          {loginResponse.message}
        </Alert>
      )}
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <TextInput
            name="username"
            label="Username"
            defaultValue="customer@gmail.com"
            placeholder="your@email.com"
            required
          />
          <PasswordInput
            name="password"
            label="Password"
            defaultValue='123456'
            placeholder="Your password"
            required
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Anchor component={Link} to="/auth/recover-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;