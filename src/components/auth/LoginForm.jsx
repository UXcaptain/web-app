import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';
  import classes from './AuthenticationTitle.module.css';
  import  apiClient from '../../config/API/axiosConfig.mjs';
  import { Link } from "react-router";

  
  export function LoginForm() {
    
    const navigate = useNavigate();

    const [loginResponse, setLoginResponse] = useState(null);


    
    const handleLogin = async (e) => {
        

        e.preventDefault();

      const data = {
          username: e.target.username.value,
          password: e.target.password.value,
          rememberMe: e.target.rememberMe.value,
      }

        try {

            const loginResponse = await apiClient.post('/api/v1/auth/login/local', data);

            switch (loginResponse.data.user.role) {
                case "admin":
                    return navigate('/admin');
                case "customer":
                    return navigate('/user');
                default:
                    return navigate('/');
            };

        } catch (error) {
            console.error(error);  

            if (error.response.status === 401) {
                setLoginResponse(
                    { 
                        message: 'The combination of email and password is incorrect' 
                    }
                );
            }
            else {
                setLoginResponse({
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
        {loginResponse && (
          <Paper shadow="xs" p={10} mt={20} radius="sm" style={{ backgroundColor: '#ffcccc' }}>
            {loginResponse.message}
          </Paper>
        )}
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleLogin}>
            <TextInput name="username" label="username" placeholder="you@mantine.dev" required defaultValue="username2@gmail.com" />
            <PasswordInput name="password" label="password" placeholder="Your password" required mt="md" defaultValue="password" />
            <Group justify="space-between" mt="lg">
              <Checkbox name="rememberMe" label="Remember me" />
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

  export default LoginForm