import { useState } from 'react';
import { useForm } from '@mantine/form';
import apiClient from '../../../config/API/axiosConfig.mjs';
import {
  Container,
  Paper,
  Stack,
  Title,
  Alert,
  TextInput,
  Checkbox,
  Anchor,
  Button,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

const WaitlistSignupForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState({
    loading: false,
    success: false,
    error: false,
  });

  const form = useForm({
    initialValues: {
      email: '',
      consent: false,
      honeypot: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Introduce un correo válido'),
      consent: (value) => (value ? null : 'Debes aceptar los términos para continuar'),
    },
  });

  const handleSubmit = async (values) => {
    if (values.honeypot) return; // Honeypot check

    setSubmissionStatus({ loading: true, success: false, error: false });

    try {
      const response = await apiClient.post(`api/v1/waitlist`,
        {
          email: values.email,
          consent: values.consent,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSubmissionStatus({ loading: false, success: true, error: false });
        form.reset();
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      setSubmissionStatus({ loading: false, success: false, error: true });
    }
  };

  return (
    <Container size="sm" py="xl" id="waitlist-form">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="xl">
          <Title order={2} ta="center">
            Únete a la lista de espera
          </Title>

          {submissionStatus.success && (
            <Alert
              icon={<IconCheck size={16} />}
              title="¡Éxito!"
              color="green"
            >
              Te hemos apuntado. Te avisaremos cuando abramos acceso.
            </Alert>
          )}

          {submissionStatus.error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              No hemos podido procesar tu solicitud. Inténtalo de nuevo en unos minutos.
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Correo electrónico"
                placeholder="tu@email.com"
                {...form.getInputProps('email')}
              />

              <Checkbox
                label={
                  <>
                    Acepto recibir comunicaciones comerciales
                    {/* Acepto los{' '}
                    <Anchor href="/terminos-condiciones" target="_blank">
                      términos y condiciones
                    </Anchor> */}
                  </>
                }
                {...form.getInputProps('consent')}
              />

              {/* Honeypot field */}
              <TextInput
                type="text"
                name="honeypot"
                style={{ display: 'none' }}
                {...form.getInputProps('honeypot')}
              />

              <Button
                type="submit"
                loading={submissionStatus.loading}
                disabled={submissionStatus.success}
                fullWidth
                size="md"
              >
                {submissionStatus.loading ? 'Procesando...' : 'Únete a la lista de espera'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default WaitlistSignupForm;