import { Card, Text, List, ThemeIcon, Stack } from '@mantine/core';
import { IconInfoCircle, IconPlayerPlay, IconAlertTriangle } from '@tabler/icons-react';

export const Instructions = ({ phase = 'setup' }) => {
  const setupInstructions = [
    "Introduce el ID del análisis que has recibido",
    "Comparte toda tu pantalla y tu micrófono",
    "Comparte tu feedback - positivo y negativo - de manera constante y en voz alta.",
    "Completa cada tarea lo mejor que puedas, si no puedes completar una, continúa a la siguiente",
  ];

  const analysisInstructions = [
    "Vuelve a esta pestaña para si necesitar recordar la tarea o continuar a la siguiente",
    "Adopta el escenario mostrado en el campo \"escenario\" durante el análisis",
    "Completa cada tarea lo mejor que puedas, si no puedes completar una, continúa a la siguiente",
    "Comparte tu feedback - positivo y negativo - de manera constante y en voz alta.",
    "No pases a la siguiente tarea hasta haber completado la tarea anterior"
  ];

  const warnings = [
    "Asegúrate que tu micrófono funciona correctamente ",
    "Recuerda que se compartirá toda tu pantalla",
    "Si la grabación se detiene, se perderá la grabación y tu participación no será registrada",
    "No cierres esta ventana o dejes de compartir hasta que el análisis haya sido finalizado",
  ];

  return (
    <Card withBorder shadow="sm" p="lg" radius="md" mb="xl">
      <Stack spacing="md">
        <Text size="lg" fw={600} c="blue">
          <IconInfoCircle size={20} style={{ marginRight: 8 }} />
          {(phase === 'setup' ? '¿Cómo participar?' : '¿Cómo debo completar el análisis?')}
        </Text>
        
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="blue" size={24} radius="xl">
              <IconPlayerPlay size={16} />
            </ThemeIcon>
          }
        >
          {(phase === 'setup' ? setupInstructions : analysisInstructions).map((instruction, index) => (
            <List.Item key={index}>{instruction}</List.Item>
          ))}
        </List>
        
        {phase === 'analysis' && (
          <>
            <Text size="md" fw={600} c="orange" mt="md">
              <IconAlertTriangle size={20} style={{ marginRight: 8 }} />
              Recordatorios importantes
            </Text>
            
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconAlertTriangle size={16} />
                </ThemeIcon>
              }
            >
              {warnings.map((warning, index) => (
                <List.Item key={index}>{warning}</List.Item>
              ))}
            </List>
          </>
        )}
      </Stack>
    </Card>
  );
};