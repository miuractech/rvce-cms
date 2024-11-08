import React, { useState } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Button, Stack, Title, Paper, Container } from '@mantine/core';
import * as yup from 'yup';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { notifications } from '@mantine/notifications';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red'
      });
    }
  });

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo.png"
            alt="Logo"
            style={{ height: '48px', width: 'auto', margin: '0 auto' }}
          />
          <Title order={2} mt="md">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </Title>
        </div>

        <Paper shadow="sm" p="xl" radius="md">
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                required
                label="Email address"
                placeholder="Enter your email"
                {...form.getInputProps('email')}
              />

              <TextInput
                required
                type="password"
                label="Password"
                placeholder="Enter your password"
                {...form.getInputProps('password')}
              />

              <Button type="submit" fullWidth>
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </Stack>
          </form>

          <Stack gap="xs" align="center" mt="xl">
            <div style={{ color: 'gray' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </div>
            <Button 
              variant="subtle" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};